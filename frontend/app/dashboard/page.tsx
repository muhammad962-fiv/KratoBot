"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Project = {
  project_id: string;
  project_name: string;
  brand_website?: string;
  created_at?: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    const token = typeof window !== "undefined" ? localStorage.getItem("krato_token") : undefined;
    fetch(`${api}/api/projects`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="w-5 h-5 border-2 border-zinc-200 border-t-krato rounded-full animate-spin" />
          <span className="text-sm">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-zinc-900 mb-1">Your Projects</h1>
            <p className="text-zinc-500 text-sm">Manage your marketing intelligence campaigns</p>
          </div>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-krato hover:bg-krato-light text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-krato/20 hover:shadow-lg hover:shadow-krato/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <Link
          href="/dashboard/new"
          className="card-elevate p-5 flex items-center gap-4 group"
        >
          <div className="w-11 h-11 rounded-xl bg-krato/10 flex items-center justify-center text-krato group-hover:bg-krato group-hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">Create Project</h3>
            <p className="text-xs text-zinc-400">Set up a new analysis</p>
          </div>
        </Link>

        <div className="card-elevate p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">{projects.length} Projects</h3>
            <p className="text-xs text-zinc-400">Total created</p>
          </div>
        </div>

        <div className="card-elevate p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">AI Intelligence</h3>
            <p className="text-xs text-zinc-400">Powered by KratoBot</p>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center card-elevate p-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-zinc-900 mb-2">No projects yet</h3>
          <p className="text-zinc-500 mb-6 text-sm max-w-sm">
            Create your first marketing intelligence project to start analyzing your brand and competitors.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-krato hover:bg-krato-light text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-krato/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Project
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project, idx) => (
            <motion.div
              key={project.project_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Link
                href={`/dashboard/${project.project_id}`}
                className="card-elevate p-6 block group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-krato to-krato-dark flex items-center justify-center text-white font-bold text-lg shadow-md shadow-krato/15">
                    {project.project_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-lg border border-emerald-500/15">
                    Active
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 mb-1 group-hover:text-krato transition-colors">
                  {project.project_name}
                </h3>

                <p className="text-zinc-400 text-sm mb-4 break-all line-clamp-1">
                  {project.brand_website || "No website provided"}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <span className="text-xs text-zinc-400">
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                  <span className="text-xs font-medium text-krato opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Open
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
