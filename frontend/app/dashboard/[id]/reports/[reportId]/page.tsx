"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import MarkdownRenderer from "../../../../../styles/MarkdownRenderer";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, Cell,
} from "recharts";

type CompetitorAnalytics = {
  competitor_id: number;
  domain: string;
  authority_score: number;
  backlink_count: number;
  sentiment_score: number;
  extracted_keywords: string[] | string;
};

type ReportData = {
  report_id: number;
  report_title: string;
  report_content: string;
  brand_authority_score: number;
  estimated_backlinks: number;
  extracted_keywords: string[];
  sentiment_score: number;
  generated_at: string;
  brand_website: string;
  competitor_analytics: CompetitorAnalytics[];
};

const api = process.env.NEXT_PUBLIC_API_URL;
const BRAND_COLOR = "#408CF1";
/* zinc-400 — zinc-600 was too close to the dark card background to be visible */
const COMPETITOR_COLOR = "#a1a1aa";

/* MySQL DECIMAL columns come back as strings via mysql2, and rows can be sparse,
   so every chart value is coerced before it reaches Recharts. */
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const shortDomain = (d?: string) =>
  (d ?? "Unknown").replace("www.", "").slice(0, 15);

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const { id, reportId } = React.use(params);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedAuthority, setAnimatedAuthority] = useState(0);

  useEffect(() => {
    if (!reportId) return;
    fetchReport();
  }, [reportId]);

  useEffect(() => {
    if (!report) return;
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= report.brand_authority_score) {
        start = report.brand_authority_score;
        clearInterval(interval);
      }
      setAnimatedAuthority(start);
    }, 20);
    return () => clearInterval(interval);
  }, [report]);

  async function fetchReport() {
    try {
      const token = localStorage.getItem("krato_token");
      const res = await fetch(`${api}/api/reports/${reportId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      console.error("Failed to fetch report:", err);
    } finally {
      setLoading(false);
    }
  }

  /* Never trust the payload shape — an analysis with no competitors yet
     returns an empty list, and a failed join can omit the key entirely. */
  const competitors = useMemo(
    () => (Array.isArray(report?.competitor_analytics) ? report.competitor_analytics : []),
    [report]
  );
  const hasCompetitors = competitors.length > 0;

  const authorityChartData = useMemo(() => {
    if (!report) return [];
    return [
      { domain: "Your Brand", authority: num(report.brand_authority_score), isBrand: true },
      ...competitors.map((c) => ({
        domain: shortDomain(c.domain),
        authority: num(c.authority_score),
        isBrand: false,
      })),
    ];
  }, [report, competitors]);

  const sentimentData = useMemo(() => {
    if (!report) return [];
    return [
      { domain: "Your Brand", sentiment: Number((num(report.sentiment_score) * 100).toFixed(1)), isBrand: true },
      ...competitors.map((c) => ({
        domain: shortDomain(c.domain),
        sentiment: Number((num(c.sentiment_score) * 100).toFixed(1)),
        isBrand: false,
      })),
    ];
  }, [report, competitors]);

  const backlinkData = useMemo(() => {
    if (!report) return [];
    return [
      { domain: "Your Brand", backlinks: num(report.estimated_backlinks) },
      ...competitors.map((c) => ({
        domain: shortDomain(c.domain),
        backlinks: num(c.backlink_count),
      })),
    ];
  }, [report, competitors]);

  const radarData = useMemo(() => {
    if (!report) return [];
    return [
      { metric: "Authority", value: num(report.brand_authority_score) },
      { metric: "Sentiment", value: num(report.sentiment_score) * 100 },
      { metric: "Backlinks", value: Math.min(100, (num(report.estimated_backlinks) / 10000) * 100) },
      { metric: "Keywords", value: Math.min(100, (report.extracted_keywords?.length || 0) * 2) },
    ];
  }, [report]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <span className="w-5 h-5 border-2 border-zinc-700 border-t-krato rounded-full animate-spin" />
          <span className="text-sm">Loading report...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-white mb-2">Report not found</h2>
          <p className="text-zinc-500 text-sm">The report could not be loaded.</p>
        </div>
      </div>
    );
  }

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (animatedAuthority / 100) * circumference;

  return (
    <div className="min-h-screen bg-dark-950 text-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Report Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-8 shadow-glass mb-6"
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">{report.report_title}</h1>
              <p className="text-zinc-400">Digital Marketing Intelligence Report</p>
              <p className="text-krato mt-2 text-sm font-medium">{report.brand_website}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 text-center">
                <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Competitors</p>
                <p className="text-3xl font-bold text-white">{competitors.length}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 text-center">
                <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Keywords</p>
                <p className="text-3xl font-bold text-white">{report.extracted_keywords?.length || 0}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 text-center hidden sm:block">
                <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Generated</p>
                <p className="text-sm text-zinc-300 mt-1">{new Date(report.generated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          {/* Authority Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-4 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 flex flex-col items-center justify-center"
          >
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Authority Score</h2>
            <div className="relative w-[240px] h-[240px]">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle cx="120" cy="120" r={radius} stroke="#27272a" strokeWidth="14" fill="transparent" />
                <motion.circle
                  cx="120" cy="120" r={radius} stroke={BRAND_COLOR} strokeWidth="14" fill="transparent"
                  strokeLinecap="round" strokeDasharray={circumference}
                  animate={{ strokeDashoffset: progress }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold" style={{ color: BRAND_COLOR }}>{animatedAuthority}</span>
                <span className="text-zinc-500 text-sm mt-1">/ 100</span>
              </div>
            </div>
            <p className="mt-6 text-center text-zinc-500 text-xs max-w-[200px]">
              Brand authority based on backlinks, keywords, and sentiment
            </p>
          </motion.div>

          {/* Authority Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="xl:col-span-5 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6"
          >
            <div className="flex justify-between items-center mb-5 gap-4">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Authority Comparison</h2>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500 shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: BRAND_COLOR }} />
                  You
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COMPETITOR_COLOR }} />
                  Competitors
                </span>
              </div>
            </div>
            {hasCompetitors ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={authorityChartData}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                    <XAxis dataKey="domain" stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
                    <YAxis stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b", border: "1px solid #27272a",
                        borderRadius: "12px", fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="authority" radius={[6, 6, 0, 0]}>
                      {authorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isBrand ? BRAND_COLOR : COMPETITOR_COLOR} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart />
            )}
          </motion.div>

          {/* Sentiment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-3 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6"
          >
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-5">Sentiment</h2>
            <div className="space-y-3">
              {sentimentData.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                    item.isBrand
                      ? "bg-krato/[0.06] border-krato/20"
                      : "bg-white/[0.02] border-white/[0.04]"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.domain}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Score</p>
                  </div>
                  <span className="text-xl font-bold" style={{ color: item.isBrand ? BRAND_COLOR : "#4ade80" }}>
                    {item.sentiment}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6"
          >
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-5">Backlink Strength</h2>
            {hasCompetitors ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={backlinkData}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                    <XAxis dataKey="domain" stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
                    <YAxis stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b", border: "1px solid #27272a",
                        borderRadius: "12px", fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="backlinks" stroke={BRAND_COLOR} strokeWidth={2.5}
                      dot={{ r: 4, fill: BRAND_COLOR, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart height="h-[280px]" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6"
          >
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-5">Performance Radar</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#3f3f46" />
                  <PolarAngleAxis dataKey="metric" stroke="#d4d4d8" style={{ fontSize: "12px" }} />
                  <PolarRadiusAxis stroke="#52525b" style={{ fontSize: "10px" }} />
                  <Radar dataKey="value" stroke={BRAND_COLOR} fill={BRAND_COLOR} strokeWidth={2} fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* AI Strategy Report */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/[0.06] bg-zinc-950 p-8"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.06]">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">AI Strategy Report</h2>
              <p className="text-zinc-500 text-sm">Generated competitive intelligence</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-600 uppercase tracking-wider">Generated</p>
              <p className="text-zinc-400 text-sm mt-0.5">
                {new Date(report.generated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <MarkdownRenderer content={report.report_content} />
        </motion.div>
      </div>
    </div>
  );
}

/* Shown when the analysis produced no competitor rows, so charts that only make
   sense as a comparison don't render as a single lonely bar. */
function EmptyChart({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={`${height} flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-white/[0.08]`}>
      <svg className="w-8 h-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M7 16v-4m5 4V8m5 8v-6" />
      </svg>
      <p className="text-sm text-zinc-500">No competitor data</p>
      <p className="text-xs text-zinc-600 mt-1 max-w-[220px]">
        Add competitors to this project and run an analysis to see the comparison.
      </p>
    </div>
  );
}
