"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import GlassCard from "./GlassCard";
import MagneticButton from "./MagneticButton";

const HeroScene = lazy(() => import("./HeroScene"));

/* ════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════ */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-dark-950/70 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/images/logo.svg" alt="KratoBot" className="w-8 h-8" draggable={false} />
          <span className="text-lg font-display font-bold text-white tracking-tight">
            KratoBot
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-zinc-400 hover:text-white transition">Features</a>
          <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition">How it Works</a>
          <a href="#insights" className="text-sm text-zinc-400 hover:text-white transition">Insights</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition px-4 py-2">
            Log in
          </Link>
          <MagneticButton href="/signup" size="sm">Get Started</MagneticButton>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-dark-950/95 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-6 flex flex-col gap-4"
        >
          <a href="#features" className="text-sm text-zinc-300" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm text-zinc-300" onClick={() => setMenuOpen(false)}>How it Works</a>
          <a href="#insights" className="text-sm text-zinc-300" onClick={() => setMenuOpen(false)}>Insights</a>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="text-sm text-zinc-400 px-4 py-2">Log in</Link>
            <MagneticButton href="/signup" size="sm">Get Started</MagneticButton>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-transparent to-dark-950 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950/70 via-transparent to-dark-950/30 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-krato/10 border border-krato/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-krato animate-pulse" />
              <span className="text-xs font-medium text-krato tracking-wide uppercase">
                AI Marketing Intelligence
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-display-xl font-display font-bold text-white mb-6"
          >
            Turn marketing data{" "}
            <span className="text-gradient-krato">into decisions.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed"
          >
            KratoBot transforms your marketing data into clear insights, competitive intelligence,
            and actionable recommendations — automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton href="/signup" size="lg">
              Get Started Free
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </MagneticButton>
            <MagneticButton href="#features" variant="secondary" size="lg">
              See How It Works
            </MagneticButton>
          </motion.div>
        </div>

        {/* Floating glass UI elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="hidden xl:block absolute right-12 top-1/3"
        >
          <div className="glass-panel rounded-xl p-4 w-56 animate-float">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-400">Authority Score</span>
            </div>
            <div className="text-2xl font-bold text-white">87<span className="text-sm text-zinc-500">/100</span></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="hidden xl:block absolute right-32 bottom-1/3"
        >
          <div className="glass-panel rounded-xl p-4 w-52 animate-float-slow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-krato" />
              <span className="text-xs text-zinc-400">Insights Found</span>
            </div>
            <div className="text-2xl font-bold text-white">24</div>
            <div className="text-xs text-emerald-400 mt-1">+6 since last report</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent z-[2]" />
    </section>
  );
}

/* ════════════════════════════════════════
   PRODUCT VISUALIZATION
   ════════════════════════════════════════ */
function ProductVisualization() {
  const cards = [
    { icon: "01", title: "Marketing Data", desc: "Your campaigns, audience, and competitive landscape", color: "krato" },
    { icon: "02", title: "Intelligent Analysis", desc: "Patterns, signals, and opportunities surfaced automatically", color: "emerald-400" },
    { icon: "03", title: "Clear Insights", desc: "Complex data becomes understandable, actionable intelligence", color: "amber-400" },
  ];

  return (
    <section id="insights" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold text-white mb-4">
            See the full picture
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            KratoBot connects the dots between your marketing data, competitive landscape, and growth opportunities.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <GlassCard key={i} hover delay={i * 0.15} className="p-8">
              <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 border border-${card.color}/20 flex items-center justify-center mb-5`}>
                <span className={`text-sm font-bold text-${card.color}`}>{card.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Connection visual */}
        <AnimatedSection delay={0.4} className="mt-12 flex justify-center">
          <div className="flex items-center gap-3 text-zinc-600">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-700" />
            <span className="text-xs uppercase tracking-widest text-zinc-500">Powered by KratoBot Intelligence</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-700" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FEATURES (BENTO GRID)
   ════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      title: "Marketing Intelligence",
      desc: "Understand your market position with AI-powered analysis of trends, sentiment, and opportunities across your industry.",
      span: "md:col-span-2",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Competitive Analysis",
      desc: "See exactly where you stand against competitors with authority scores, backlink analysis, and keyword comparisons.",
      span: "md:col-span-1",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Automated Reports",
      desc: "Generate detailed, client-ready reports with charts, data tables, and strategic recommendations in one click.",
      span: "md:col-span-1",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Brand Authority Tracking",
      desc: "Monitor your brand authority score over time with backlink strength, sentiment analysis, and keyword extraction.",
      span: "md:col-span-2",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Audience Understanding",
      desc: "Define and refine your target audience with AI-generated insights about who your ideal customers are.",
      span: "md:col-span-1",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Actionable Recommendations",
      desc: "Every report includes clear next steps — strategic moves you can implement immediately to improve performance.",
      span: "md:col-span-1",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      ),
    },
    {
      title: "Performance Tracking",
      desc: "Track campaign performance over time with visual charts, trend lines, and historical comparisons.",
      span: "md:col-span-2",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-krato font-semibold mb-4 block">
            Capabilities
          </span>
          <h2 className="text-display-lg font-display font-bold text-white mb-4">
            Everything you need to<br className="hidden md:block" /> outperform the market
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            From competitive analysis to strategic recommendations, KratoBot gives you the intelligence edge.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <GlassCard key={i} hover delay={i * 0.08} className={`${f.span} p-8`}>
              <div className="w-11 h-11 rounded-xl bg-krato/10 border border-krato/20 flex items-center justify-center text-krato mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   HOW IT WORKS
   ════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect Your Marketing Data",
      desc: "Enter your brand website, niche, target audience, and marketing goals. KratoBot receives everything needed to understand your marketing environment.",
    },
    {
      num: "02",
      title: "KratoBot Analyzes It",
      desc: "The platform identifies patterns, performance signals, competitive gaps, and important changes in your market landscape.",
    },
    {
      num: "03",
      title: "Understand What Matters",
      desc: "Complex marketing data becomes clear insights — authority scores, sentiment analysis, keyword intelligence, and competitive positioning.",
    },
    {
      num: "04",
      title: "Take Action",
      desc: "KratoBot turns insights into practical recommendations and detailed reports you can use immediately to improve your strategy.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-krato font-semibold mb-4 block">
            Process
          </span>
          <h2 className="text-display-lg font-display font-bold text-white mb-4">
            How KratoBot works
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            From data to decisions in four simple steps.
          </p>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connection line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-krato/30 via-krato/15 to-transparent hidden md:block" />

          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <div className={`flex flex-col md:flex-row items-start gap-8 mb-16 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                {/* Number */}
                <div className="flex-shrink-0 md:w-1/2 flex md:justify-end md:pr-12">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-krato/10 border border-krato/20 flex items-center justify-center">
                      <span className="text-xl font-display font-bold text-krato">{step.num}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-1/2 md:pl-4">
                  <GlassCard hover className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                  </GlassCard>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FINAL CTA
   ════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-krato/[0.06] blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-display-lg font-display font-bold text-white mb-6">
            Your marketing data already knows the answer.
          </h2>
          <p className="text-xl text-zinc-400 mb-4">
            KratoBot helps you see it.
          </p>
          <p className="text-zinc-500 max-w-lg mx-auto mb-10">
            Start analyzing your brand, competitors, and market positioning today with intelligent, visual reports.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton href="/signup" size="lg">
              Get Started Free
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </MagneticButton>
            <MagneticButton href="/login" variant="secondary" size="lg">
              Log In
            </MagneticButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.svg" alt="KratoBot" className="w-6 h-6" draggable={false} />
            <span className="text-sm font-display font-bold text-zinc-400">KratoBot</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <a href="#features" className="hover:text-zinc-300 transition">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-300 transition">How it Works</a>
            <Link href="/login" className="hover:text-zinc-300 transition">Login</Link>
            <Link href="/signup" className="hover:text-zinc-300 transition">Sign Up</Link>
          </div>

          <p className="text-sm text-zinc-600">
            &copy; 2026 KratoBot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════
   EXPORTED HOMEPAGE
   ════════════════════════════════════════ */
export default function Homepage() {
  return (
    <div className="bg-dark-950 text-white">
      <Navigation />
      <HeroSection />
      <ProductVisualization />
      <FeaturesSection />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  );
}
