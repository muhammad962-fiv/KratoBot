"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SUGGESTED_NICHES = [
  "E-Commerce", "SaaS", "Personal Brand", "Education",
  "Non-Profit", "Healthcare", "Finance", "Fitness",
  "Real Estate", "Food & Beverage",
];

const STEPS = [
  "Project Info",
  "Niche",
  "Target Audience",
  "Goals & Budget",
  "Competitors",
];

export default function NewProjectOnboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [marketingGoals, setMarketingGoals] = useState("");
  const [budget, setBudget] = useState("");
  const [competitors, setCompetitors] = useState<{ website_url: string }[]>([
    { website_url: "" },
  ]);

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = typeof window !== "undefined" ? localStorage.getItem("krato_token") : undefined;
      const res = await fetch(`${api}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          project_name: projectName,
          brand_website: brandWebsite,
          niche: niche || customNiche,
          target_audience: targetAudience,
          marketing_goals: marketingGoals,
          budget,
          competitors: competitors
            .map((c) => c.website_url.trim())
            .filter(Boolean)
            .map((website_url) => ({ website_url }))
            .slice(0, 5),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setDone(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 60 : -60,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    setDirection(1);
    setTimeout(() => nextStep(), 0);
  };
  const goBack = () => {
    setDirection(-1);
    setTimeout(() => prevStep(), 0);
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-elevate p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-zinc-900 mb-2">Project Created!</h2>
          <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
            Your project is ready. Head to your dashboard to run your first analysis.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-krato text-white font-semibold rounded-xl shadow-md shadow-krato/20 hover:bg-krato-light transition"
          >
            Go to Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">New Project</h1>
        <p className="text-zinc-500 text-sm">Set up your marketing intelligence project in a few steps.</p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-zinc-100">
              <motion.div
                className="h-full bg-krato rounded-full"
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span className={`text-xs font-medium transition-colors ${
              i <= step ? "text-krato" : "text-zinc-400"
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div className="card-elevate p-8 min-h-[320px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Project Info */}
            {step === 0 && (
              <motion.div key="step0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-display font-bold text-zinc-900 mb-6">Project Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Project Name</label>
                    <input
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                      placeholder="e.g. Growthify"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                      maxLength={40}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Brand Website URL</label>
                    <input
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                      placeholder="e.g. https://growthify.com"
                      type="url"
                      value={brandWebsite}
                      onChange={(e) => setBrandWebsite(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Niche */}
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-display font-bold text-zinc-900 mb-2">Select a Niche</h2>
                <p className="text-zinc-400 text-sm mb-6">Choose from suggestions or add your own.</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {SUGGESTED_NICHES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        niche === n
                          ? "bg-krato text-white border-krato shadow-md shadow-krato/20"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-krato/30 hover:text-krato"
                      }`}
                      onClick={() => { setNiche(n); setCustomNiche(""); }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <input
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                  value={customNiche}
                  onChange={(e) => { setCustomNiche(e.target.value); setNiche(""); }}
                  placeholder="Or add your own niche"
                />
              </motion.div>
            )}

            {/* Step 3: Target Audience */}
            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-display font-bold text-zinc-900 mb-2">Target Audience</h2>
                <p className="text-zinc-400 text-sm mb-6">Describe your ideal customers or users.</p>
                <input
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                  placeholder="e.g. Small business owners aged 25-45 interested in digital marketing"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  maxLength={120}
                  required
                />
              </motion.div>
            )}

            {/* Step 4: Goals & Budget */}
            {step === 3 && (
              <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-display font-bold text-zinc-900 mb-6">Goals & Budget</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Marketing Goals</label>
                    <input
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                      placeholder="e.g. Acquire leads, Brand awareness"
                      value={marketingGoals}
                      onChange={(e) => setMarketingGoals(e.target.value)}
                      maxLength={120}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Monthly Budget (USD)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                      placeholder="e.g. 1000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      min={0}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Competitors */}
            {step === 4 && (
              <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-display font-bold text-zinc-900">Competitors</h2>
                    <p className="text-zinc-400 text-sm">Add up to 5 competitor websites.</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-krato/30 text-krato text-sm font-medium hover:bg-krato/5 transition"
                    disabled={competitors.length >= 5}
                    onClick={() => setCompetitors((prev) => [...prev, { website_url: "" }])}
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-3">
                  {competitors.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-krato/50 focus:ring-1 focus:ring-krato/20 transition"
                        placeholder={`Competitor website #${idx + 1}`}
                        value={c.website_url}
                        onChange={(e) =>
                          setCompetitors((prev) =>
                            prev.map((v, i) => (i === idx ? { ...v, website_url: e.target.value } : v))
                          )
                        }
                        maxLength={80}
                      />
                      {competitors.length > 1 && (
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition"
                          onClick={() => setCompetitors((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="px-5 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-0 disabled:pointer-events-none transition"
          >
            &larr; Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="px-6 py-2.5 bg-krato text-white text-sm font-semibold rounded-xl shadow-md shadow-krato/20 hover:bg-krato-light transition"
            >
              Next &rarr;
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-krato text-white text-sm font-semibold rounded-xl shadow-md shadow-krato/20 hover:bg-krato-light transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
