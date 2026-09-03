import { NextRequest, NextResponse } from "next/server";
import cors, { withCors } from "../../../utils/cors";
import { verifyJWT } from "../../../middleware/auth";
import { pool } from "../../../config/database";
import { projectCache } from "../../../utils/cache";

export const OPTIONS = cors;

export const GET = withCors(async function (req: NextRequest) {
  try {
    const user = verifyJWT(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check cache
    const cacheKey = `projects:${user.user_id}`;
    const cached = projectCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { "Cache-Control": "private, max-age=30" },
      });
    }

    // Single query: get all projects
    const [projects]: any = await pool.query(
      `SELECT * FROM Projects WHERE user_id = ? ORDER BY created_at DESC`,
      [user.user_id]
    );

    // Batch query: get all competitors for all projects at once (fixes N+1)
    if (projects.length > 0) {
      const projectIds = projects.map((p: any) => p.project_id);
      const placeholders = projectIds.map(() => "?").join(",");

      const [allCompetitors]: any = await pool.query(
        `SELECT * FROM Competitors WHERE project_id IN (${placeholders}) ORDER BY created_at ASC`,
        projectIds
      );

      // Group competitors by project_id
      const grouped = new Map<number, any[]>();
      for (const comp of allCompetitors) {
        if (!grouped.has(comp.project_id)) grouped.set(comp.project_id, []);
        grouped.get(comp.project_id)!.push(comp);
      }

      for (const project of projects) {
        project.competitors = grouped.get(project.project_id) || [];
      }
    } else {
      for (const project of projects) {
        project.competitors = [];
      }
    }

    const result = { projects };
    projectCache.set(cacheKey, result);

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "private, max-age=30" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
});

export const POST = withCors(async function (req: NextRequest) {
  const conn = await pool.getConnection();
  try {
    const user = verifyJWT(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { project_name, brand_website, niche, target_audience, marketing_goals, budget, competitors } = body;

    if (!project_name || !brand_website) {
      return NextResponse.json({ error: "project_name and brand_website required" }, { status: 400 });
    }

    await conn.beginTransaction();

    // 1. Create project
    const [result]: any = await conn.query(
      `INSERT INTO Projects (user_id, project_name, brand_website, niche, target_audience, marketing_goals, budget)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.user_id, project_name, brand_website, niche ?? null, target_audience ?? null, marketing_goals ?? null, budget ?? null]
    );
    const project_id = result.insertId;

    // 2. Create competitors
    if (Array.isArray(competitors)) {
      for (const item of competitors) {
        if (item.website_url) {
          await conn.query(
            `INSERT INTO Competitors (project_id, website_url) VALUES (?, ?)`,
            [project_id, item.website_url]
          );
        }
      }
    }

    await conn.commit();

    // Invalidate cache on write
    projectCache.invalidatePrefix(`projects:${user.user_id}`);

    return NextResponse.json({ message: "Project and competitors created", project_id }, { status: 201 });
  } catch (e) {
    await conn.rollback();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    conn.release();
  }
});
