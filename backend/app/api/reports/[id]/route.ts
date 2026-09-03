import { NextRequest, NextResponse } from "next/server";
import cors, { withCors } from "../../../../utils/cors";
import { verifyJWT } from "../../../../middleware/auth";
import { pool } from "../../../../config/database";
import { reportCache } from "../../../../utils/cache";

function getReportId(req: NextRequest): number | null {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();
  return id && !isNaN(Number(id)) ? Number(id) : null;
}

function safeParseJSON(input: any): any[] {
  try {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return JSON.parse(input);
    return [];
  } catch (e) {
    console.error("JSON PARSE ERROR (extracted_keywords):", e);
    return [];
  }
}

export const OPTIONS = cors;

export const GET = withCors(async function (req: NextRequest) {
  try {
    const user = verifyJWT(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const report_id = getReportId(req);
    if (!report_id) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

    // Check cache
    const cacheKey = `report:${user.user_id}:${report_id}`;
    const cached = reportCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { "Cache-Control": "private, max-age=60" },
      });
    }

    // Run report + competitors queries in parallel
    const [reportResult, competitorResult]: any[] = await Promise.all([
      pool.query(
        `SELECT 
          r.report_id, r.project_id, r.report_title, r.report_content, r.status, r.generated_at,
          r.brand_authority_score, r.estimated_backlinks, r.extracted_keywords, r.sentiment_score,
          p.project_name, p.brand_website
        FROM Reports r
        INNER JOIN Projects p ON r.project_id = p.project_id
        WHERE r.report_id = ? AND p.user_id = ?
        LIMIT 1`,
        [report_id, user.user_id]
      ),
      // We don't know project_id yet, but we can still parallelize by fetching
      // competitors via a subquery join on the report
      pool.query(
        `SELECT c.competitor_id, c.website_url as domain
         FROM Competitors c
         INNER JOIN Reports r ON c.project_id = r.project_id
         WHERE r.report_id = ? AND r.project_id IN (
           SELECT project_id FROM Reports WHERE report_id = ?
         )`,
        [report_id, report_id]
      ),
    ]);

    const report = reportResult[0]?.[0];

    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const competitors = competitorResult[0] || [];
    const competitorIds = competitors.map((c: any) => c.competitor_id);

    let competitorAnalytics: any[] = [];

    if (competitorIds.length > 0) {
      const placeholders = competitorIds.map(() => "?").join(",");

      const [analyticsRows]: any = await pool.query(
        `SELECT 
          ca.*, c.website_url as domain
        FROM Competitor_Analytics ca
        INNER JOIN Competitors c ON ca.competitor_id = c.competitor_id
        WHERE ca.competitor_id IN (${placeholders})
        ORDER BY ca.analyzed_at DESC`,
        competitorIds
      );

      competitorAnalytics = analyticsRows || [];
    }

    const result = {
      report: {
        ...report,
        extracted_keywords: safeParseJSON(report.extracted_keywords),
        competitors,
        competitor_analytics: competitorAnalytics,
      },
    };

    reportCache.set(cacheKey, result);

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch (e: any) {
    console.error("REPORT API CRASH:", e);
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 500 }
    );
  }
});
