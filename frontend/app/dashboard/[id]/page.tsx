"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Competitor = {
  competitor_id: number;
  website_url: string;
};

type Project = {
  project_id: number;
  project_name: string;
  brand_website: string;
  niche?: string;
  target_audience?: string;
  marketing_goals?: string;
  budget?: number;
  created_at?: string;
  competitors: Competitor[];
};

type Report = {
  report_id: number;
  project_id: number;
  report_title: string;
  status: "processing" | "ready" | "failed";
  generated_at?: string;
  brand_authority_score?: number;
  estimated_backlinks?: number;
  sentiment_score?: number;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await Promise.all([fetchProject(), fetchReports()]);
    setLoading(false);
  }

  async function fetchProject() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("krato_token") : null;
      const res = await fetch(`${api}/api/projects/${projectId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setProject(data.project);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchReports() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("krato_token") : null;
      const res = await fetch(`${api}/api/reports?project_id=${projectId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setReports(Array.isArray(data.reports) ? data.reports : []);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="w-5 h-5 border-2 border-zinc-200 border-t-krato rounded-full animate-spin" />
          <span className="text-sm">Loading project...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-zinc-900 mb-2">Project not found</h2>
          <p className="text-zinc-500 text-sm">The project you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Hero Project Block */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevate p-8"
      >
        <div className="flex flex-col xl:flex-row gap-8 justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-krato to-krato-dark flex items-center justify-center text-white font-bold text-xl shadow-md shadow-krato/15">
                {project.project_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-zinc-900">
                  {project.project_name}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="status-pill status-ready text-[10px]">Active</span>
                  <span className="text-xs text-zinc-400">{project.brand_website}</span>
                </div>
              </div>
            </div>

            {/* Bento info grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              <InfoCard title="Niche" value={project.niche || "Not specified"} />
              <InfoCard title="Target Audience" value={project.target_audience || "Not specified"} />
              <InfoCard title="Goals" value={project.marketing_goals || "Not specified"} />
              <InfoCard
                title="Budget"
                value={project.budget ? `$${project.budget.toLocaleString()}` : "Not specified"}
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:w-[280px] flex flex-col gap-4">
            <div className="bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5">
              <h2 className="text-sm font-semibold text-zinc-700 mb-3">Competitors</h2>
              <div className="flex flex-col gap-2">
                {project.competitors?.length > 0 ? (
                  project.competitors.map((comp) => (
                    <div
                      key={comp.competitor_id}
                      className="bg-white rounded-xl px-3 py-2.5 text-sm text-zinc-600 border border-zinc-100 break-all"
                    >
                      {comp.website_url}
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 text-sm">No competitors added.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => router.push(`/dashboard/${projectId}/analyze`)}
              className="w-full bg-krato text-white rounded-xl py-3.5 font-semibold shadow-md shadow-krato/20 hover:bg-krato-light hover:shadow-lg hover:shadow-krato/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run Analysis
            </button>
          </div>
        </div>
      </motion.section>

      {/* Reports Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-display font-bold text-zinc-900">Reports</h2>
            <p className="text-zinc-500 text-sm">Generated competitor intelligence reports</p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="card-elevate p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm mb-1">No reports generated yet.</p>
            <p className="text-zinc-400 text-xs">Run your first analysis to generate insights.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report, idx) => (
              <motion.div
                key={report.report_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.06 }}
                className="card-elevate p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-zinc-900 group-hover:text-krato transition-colors">
                      {report.report_title}
                    </h3>
                    <span
                      className={`status-pill text-[10px] ${
                        report.status === "ready"
                          ? "status-ready"
                          : report.status === "processing"
                          ? "status-processing"
                          : "status-failed"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                    <span>Authority: {report.brand_authority_score ?? 0}</span>
                    <span>Backlinks: {report.estimated_backlinks ?? 0}</span>
                    <span>Sentiment: {report.sentiment_score ?? 0}</span>
                    {report.generated_at && (
                      <span>{new Date(report.generated_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/dashboard/${projectId}/reports/${report.report_id}`)}
                  className="px-5 py-2.5 rounded-xl bg-krato text-white text-sm font-semibold hover:bg-krato-light shadow-sm shadow-krato/15 transition-all duration-300 flex items-center gap-2"
                >
                  View Details
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-200/60 p-4">
      <p className="text-xs text-zinc-400 mb-1 font-medium">{title}</p>
      <p className="text-sm font-semibold text-zinc-800 break-words line-clamp-2">{value}</p>
    </div>
  );
}
