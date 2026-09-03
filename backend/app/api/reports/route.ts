import { NextRequest, NextResponse } from "next/server";
import cors, { withCors } from "../../../utils/cors";
import { verifyJWT } from "../../../middleware/auth";
import { pool } from "../../../config/database";
import { reportCache } from "../../../utils/cache";

export const OPTIONS = cors;

export const GET = withCors(async function (req: NextRequest) {
  try {
    const user = verifyJWT(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const project_id = url.searchParams.get("project_id");

    // Check cache
    const cacheKey = project_id
      ? `reports:${user.user_id}:project:${project_id}`
      : `reports:${user.user_id}:all`;
    const cached = reportCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { "Cache-Control": "private, max-age=30" },
      });
    }

    let rows: any[] = [];

    if (project_id) {
      const [resp] = await pool.query(
        `SELECT 
           r.report_id, r.project_id, r.report_title, r.status, r.generated_at,
           r.brand_authority_score, r.estimated_backlinks, r.sentiment_score,
           p.project_name, p.brand_website
         FROM Reports r
         INNER JOIN Projects p ON r.project_id = p.project_id
         WHERE r.project_id = ? AND p.user_id = ?
         ORDER BY r.generated_at DESC`,
        [project_id, user.user_id]
      );
      rows = resp as any[];
    } else {
      const [resp] = await pool.query(
        `SELECT 
           r.report_id, r.project_id, r.report_title, r.status, r.generated_at,
           r.brand_authority_score, r.estimated_backlinks, r.sentiment_score,
           p.project_name, p.brand_website
         FROM Reports r
         INNER JOIN Projects p ON r.project_id = p.project_id
         WHERE p.user_id = ?
         ORDER BY r.generated_at DESC`,
        [user.user_id]
      );
      rows = resp as any[];
    }

    const result = { reports: rows };
    reportCache.set(cacheKey, result);

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "private, max-age=30" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 500 }
    );
  }
});
