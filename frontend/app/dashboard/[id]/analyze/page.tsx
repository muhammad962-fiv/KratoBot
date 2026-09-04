"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Competitor = {
  competitor_id?: number;
  website_url: string;
};

const PROCESSING_STEPS = [
  "Analyzing campaign performance",
  "Identifying important patterns",
  "Preparing actionable insights",
  "Building your report",
];

export default function AnalyzeProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  const api = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const [projectName, setProjectName] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [marketingGoals, setMarketingGoals] = useState("");
  const [budget, setBudget] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [competitors, setCompetitors] = useState<Competitor[]>([{ website_url: "" }]);

  useEffect(() => {
    fetchProject();
  }, []);

  async function fetchProject() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("krato_token") : null;
      const res = await fetch(`${api}/api/projects/${projectId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load project");

      const project = data.project;
      setProjectName(project.project_name || "");
      setBrandWebsite(project.brand_website || "");
      setNiche(project.niche || "");
      setTargetAudience(project.target_audience || "");
      setMarketingGoals(project.marketing_goals || "");
      setBudget(project.budget?.toString() || "");
      setReportTitle(`Analysis for ${project.project_name}`);

      if (Array.isArray(project.competitors) && project.competitors.length > 0) {
        setCompetitors(project.competitors);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  async function handleRunAnalysis(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRunning(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("krato_token") : null;
      const res = await fetch(`${api}/api/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          project_id: Number(projectId),
          project_name: projectName,
          brand_website: brandWebsite,
          niche,
          target_audience: targetAudience,
          marketing_goals: marketingGoals,
          budget,
          competitors: competitors
            .map((c) => ({ website_url: c.website_url.trim() }))
            .filter((c) => c.website_url),
          report_title: reportTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start analysis");
      router.push(`/dashboard/${projectId}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setRunning(false);
    }
  }

  function addCompetitor() {
    if (competitors.length >= 5) return;
    setCompetitors((prev) => [...prev, { website_url: "" }]);
  }

  function removeCompetitor(index: number) {
    setCompetitors((prev) => prev.filter((_, i) => i !== index));
  }

  function updateCompetitor(index: number, value: string) {
    setCompetitors((prev) => prev.map((c, i) => (i === index ? { ...c, website_url: value } : c)));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="w-5 h-5 border-2 border-zinc-200 border-t-krato rounded-full animate-spin" />
          <span className="text-sm">Loading analysis setup...</span>
        </div>
      </div>
    );
  }

  /* ── Processing State ── */
  if (running) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg px-6"
        >
          {/* Animated rings */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-krato/20"
                initial={{ scale: 0.5 + i * 0.3, opacity: 0 }}
                animate={{
                  scale: [0.5 + i * 0.3, 1.2 + i * 0.3, 0.5 + i * 0.3],
                  opacity: [0, 0.4, 0],
                }}
                transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-krato/10 border border-krato/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-krato animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-zinc-900 mb-3">
            KratoBot is analyzing
          </h2>
          <p className="text-zinc-500 text-sm mb-8">This may take a moment. Your intelligence report is being generated.</p>

          <div className="space-y-3">
            {PROCESSING_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.6, duration: 0.5 }}
                className="flex items-center gap-3 text-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-krato"
                />
                <span className="text-zinc-600">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Form State ── */
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">Run Analysis</h1>
        <p className="text-zinc-500 text-sm">Configure your project analysis and generate intelligence reports.</p>
      </motion.div>

      <form onSubmit={handleRunAnalysis} className="space-y-6">
        {/* Project Information */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevate p-8"
        >
          <h2 className="text-lg font-display font-bold text-zinc-900 mb-6">Project Information</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <InputField label="Project Name" value={projectName} onChange={setProjectName} required />
            <InputField label="Brand Website" value={brandWebsite} onChange={setBrandWebsite} type="url" required />
            <InputField label="Niche" value={niche} onChange={setNiche} />
            <InputField label="Target Audience" value={targetAudience} onChange={setTargetAudience} />
            <InputField label="Marketing Goals" value={marketingGoals} onChange={setMarketingGoals} />
            <InputField label="Budget (USD)" value={budget} onChange={setBudget} type="number" />
          </div>
        </motion.section>

        {/* Report Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevate p-8"
        >
          <h2 className="text-lg font-display font-bold text-zinc-900 mb-6">Report Configuration</h2>
          <InputField label="Report Title" value={reportTitle} onChange={setReportTitle} required />
        </motion.section>

        {/* Competitors */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevate p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-zinc-900">Competitors</h2>
              <p className="text-zinc-400 text-sm">Add up to 5 competitors for comparative analysis.</p>
            </div>
            <button
              type="button"
              onClick={addCompetitor}
              disabled={competitors.length >= 5}
              className="px-4 py-2 rounded-xl border border-krato/30 text-krato text-sm font-medium hover:bg-krato/5 transition disabled:opacity-40"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {competitors.map((comp, index) => (
              <div key={index} className="flex items-center gap-2 bg-zinc-50 rounded-xl p-3 border border-zinc-200/60">
                <input
                  type="url"
                  value={comp.website_url}
                  onChange={(e) => updateCompetitor(index, e.target.value)}
                  placeholder={`Competitor Website #${index + 1}`}
                  className="flex-1 bg-white border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                />
                {competitors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCompetitor(index)}
                    className="w-9 h-9 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/${projectId}`)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-krato text-white text-sm font-semibold rounded-xl shadow-md shadow-krato/20 hover:bg-krato-light hover:shadow-lg hover:shadow-krato/30 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Run Analysis
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
      />
    </label>
  );
}
