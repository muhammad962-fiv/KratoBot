"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";

const HeroScene = React.lazy(() => import("./HeroScene"));

/* Scroll to a fraction of total page scroll (0 = top, 1 = bottom) */
function scrollToProgress(fraction: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: fraction * max, behavior: "smooth" });
}

/* ─── Performance: is a scroll segment currently on/near screen? ───
   Used to toggle `visibility: hidden` — the browser then skips painting
   that layer entirely (opacity: 0 alone still composites blurred surfaces).
   Small margin keeps crossfades seamless; state only flips at boundaries. */
function useActiveSegment(progress: MotionValue<number>, from: number, to: number) {
  const [active, setActive] = useState(from === 0); // hero visible at rest
  useMotionValueEvent(progress, "change", (v) => {
    const vis = v >= from - 0.02 && v <= to + 0.02;
    setActive((prev) => (prev === vis ? prev : vis));
  });
  return active;
}

/* ─── Button ─── */
function Btn({ href, children, variant = "primary", className = "" }: {
  href: string; children: React.ReactNode; variant?: "primary" | "ghost"; className?: string;
}) {
  const s = variant === "primary"
    ? "bg-krato text-white hover:bg-krato-light shadow-glow hover:shadow-glow-lg"
    : "bg-white/[0.06] text-white border border-white/[0.12] hover:bg-white/[0.1]";
  return (
    <Link href={href} className={`inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${s} ${className}`}>
      {children}
    </Link>
  );
}

/* ═══════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════ */
function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-[200] bg-dark-950/50 backdrop-blur-2xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/images/logo.svg" alt="" className="w-7 h-7" draggable={false} />
          <span className="text-base font-display font-bold text-white tracking-tight">KratoBot</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollToProgress(0.27); }} className="hover:text-white transition cursor-pointer">Features</a>
          <a href="#how" onClick={(e) => { e.preventDefault(); scrollToProgress(0.47); }} className="hover:text-white transition cursor-pointer">How it Works</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white px-4 py-2 transition">Log in</Link>
          <Btn href="/signup">Get Started</Btn>
        </div>
        <div className="flex md:hidden gap-3">
          <Link href="/login" className="text-sm text-zinc-400 px-3 py-1.5">Log in</Link>
          <Btn href="/signup" className="!px-4 !py-2 !text-xs">Sign Up</Btn>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO — visible at rest, fades as you scroll
   ═══════════════════════════════════════════════════ */
function HeroLayer({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  const y = useTransform(progress, [0, 1], [0, -80]);
  const scale = useTransform(progress, [0, 1], [1, 0.95]);
  const opacity = useTransform(progress, [0.5, 1], [1, 0], { clamp: false });

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, visibility: active ? "visible" : "hidden" }}
    >
      <motion.div className="w-full h-full relative flex items-center" style={{ y, scale }}>
        <div className="absolute inset-0">
          <Suspense fallback={null}><HeroScene active={active} /></Suspense>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-transparent to-dark-950 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/50 via-transparent to-transparent z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-krato/10 border border-krato/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-krato animate-pulse" />
              <span className="text-xs font-medium text-krato tracking-wide uppercase">AI Marketing Intelligence</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
              Turn marketing data{" "}<span className="text-gradient-krato">into decisions.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
              KratoBot transforms your marketing data into clear insights, competitive intelligence,
              and actionable recommendations — automatically.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }} className="flex flex-wrap gap-4">
              <Btn href="/signup">
                Get Started Free
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Btn>
              <button
                onClick={() => scrollToProgress(0.27)}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 bg-white/[0.06] text-white border border-white/[0.12] hover:bg-white/[0.1] cursor-pointer"
              >
                See How It Works
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating cards */}
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }} className="hidden xl:block absolute right-16 top-[32%] z-10">
          <div className="glass-panel rounded-xl p-4 w-52 animate-float">
            <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[11px] text-zinc-400">Authority Score</span></div>
            <div className="text-2xl font-bold text-white">87<span className="text-xs text-zinc-500">/100</span></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }} className="hidden xl:block absolute right-32 bottom-[28%] z-10">
          <div className="glass-panel rounded-xl p-4 w-48 animate-float-slow">
            <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-krato" /><span className="text-[11px] text-zinc-400">Insights Found</span></div>
            <div className="text-2xl font-bold text-white">24</div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-zinc-700 flex justify-center pt-1.5">
            <div className="w-1 h-1 rounded-full bg-zinc-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   OVERLAY SECTION — reusable wrapper for layers 2-5
   Fades in/out based on its segment scroll progress
   ═══════════════════════════════════════════════════ */
function OverlaySection({
  progress, zIndex, children, id, active,
}: {
  progress: MotionValue<number>;
  zIndex: number;
  children: React.ReactNode;
  id?: string;
  active: boolean;
}) {
  // 4-point curve: invisible → fade in → solid → fade out
  const opacity = useTransform(progress, [0, 0.12, 0.85, 1], [0, 1, 1, 0], { clamp: false });
  const y = useTransform(progress, [0, 0.12, 0.85, 1], [80, 0, 0, -50], { clamp: false });

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex, opacity, visibility: active ? "visible" : "hidden", willChange: "transform, opacity" }}
    >
      <motion.div className="w-full h-full bg-dark-950" style={{ y }} id={id}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION CONTENT — CAPABILITIES
   ═══════════════════════════════════════════════════ */
function CapabilitiesContent({ progress }: { progress: MotionValue<number> }) {
  const features = [
    { title: "Marketing Intelligence", desc: "AI-powered analysis of trends, sentiment, and opportunities across your industry.", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { title: "Competitive Analysis", desc: "Authority scores, backlink analysis, and keyword comparisons against competitors.", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { title: "Automated Reports", desc: "Detailed, client-ready reports with charts and strategic recommendations in one click.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { title: "Brand Authority", desc: "Monitor your brand authority score with backlink strength and sentiment analysis.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
    { title: "Audience Insights", desc: "Understand your ideal customers with AI-generated audience intelligence.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { title: "Actionable Strategy", desc: "Clear recommendations you can implement immediately to improve performance.", icon: "M9 5l7 7-7 7" },
  ];

  const headO = useTransform(progress, [0.06, 0.18], [0, 1]);
  const mkCard = (d: number) => ({
    o: useTransform(progress, [0.08 + d, 0.2 + d], [0, 1]),
    y: useTransform(progress, [0.08 + d, 0.2 + d], [50, 0]),
  });
  const cards = [0, 0.03, 0.06, 0.09, 0.12, 0.15].map(mkCard);

  return (
    <div className="h-full flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div style={{ opacity: headO }} className="text-center mb-8 md:mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-krato font-semibold mb-2 block">Capabilities</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Everything to outperform<br className="hidden md:block" /> the market
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            From competitive analysis to strategic recommendations — the intelligence edge you need.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {features.map((f, i) => (
            <motion.div key={i} style={{ opacity: cards[i].o, y: cards[i].y }}
              className="glass-panel-hover rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="w-10 h-10 rounded-xl bg-krato/10 border border-krato/20 flex items-center justify-center text-krato mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                </svg>
              </div>
              <h3 className="text-sm md:text-base font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION CONTENT — HOW IT WORKS (horizontal scroll)
   ═══════════════════════════════════════════════════ */
function FlowContent({ progress }: { progress: MotionValue<number> }) {
  const steps = [
    { num: "01", title: "Connect Your Data", desc: "Enter your brand, niche, audience, and goals. KratoBot receives everything it needs." },
    { num: "02", title: "KratoBot Analyzes", desc: "Patterns, signals, competitive gaps, and important changes are identified automatically." },
    { num: "03", title: "See What Matters", desc: "Complex data becomes clear insights — authority scores, sentiment, keyword intelligence." },
    { num: "04", title: "Take Action", desc: "Insights become practical recommendations and detailed reports you can use immediately." },
  ];
  const headO = useTransform(progress, [0.06, 0.18], [0, 1]);
  const cardX = useTransform(progress, [0.12, 0.8], [0, -500]);

  return (
    <div className="h-full flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div style={{ opacity: headO }} className="mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-krato font-semibold mb-3 block">Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white">How KratoBot works</h2>
        </motion.div>
        <div className="overflow-hidden">
          <motion.div style={{ x: cardX }} className="flex gap-6 pl-2">
            {steps.map((s, i) => (
              <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] glass-panel rounded-2xl p-7 md:p-8 relative">
                {i < steps.length - 1 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/10 to-transparent" />}
                <div className="w-12 h-12 rounded-xl bg-krato/10 border border-krato/20 flex items-center justify-center mb-5">
                  <span className="text-sm font-bold text-krato">{s.num}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION CONTENT — METRICS
   ═══════════════════════════════════════════════════ */
function MetricsContent({ progress }: { progress: MotionValue<number> }) {
  const metrics = [
    { label: "Authority Score", value: "87", sub: "Brand authority tracking", accent: "#408CF1" },
    { label: "Competitors", value: "5", sub: "Tracked simultaneously", accent: "#34d399" },
    { label: "Keywords", value: "240+", sub: "Extracted per analysis", accent: "#fbbf24" },
    { label: "Sentiment", value: "94%", sub: "Positive signal detection", accent: "#a78bfa" },
  ];
  const headO = useTransform(progress, [0.06, 0.18], [0, 1]);
  const mkCard = (d: number) => ({
    o: useTransform(progress, [0.08 + d, 0.2 + d], [0, 1]),
    s: useTransform(progress, [0.08 + d, 0.2 + d], [0.9, 1]),
  });
  const cards = [0, 0.04, 0.08, 0.12].map(mkCard);

  return (
    <div className="h-full flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div style={{ opacity: headO }} className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3">Intelligence at a glance</h2>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm md:text-base">
            Every metric you need, surfaced instantly from your competitive landscape.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {metrics.map((m, i) => (
            <motion.div key={i} style={{ opacity: cards[i].o, scale: cards[i].s }}
              className="glass-panel rounded-2xl p-6 md:p-7 text-center">
              <div className="text-4xl md:text-5xl font-display font-bold mb-2" style={{ color: m.accent }}>{m.value}</div>
              <p className="text-sm font-medium text-white mb-0.5">{m.label}</p>
              <p className="text-xs text-zinc-500">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION CONTENT — CTA
   ═══════════════════════════════════════════════════ */
function CTAContent({ progress }: { progress: MotionValue<number> }) {
  const contentS = useTransform(progress, [0.08, 0.3], [0.9, 1]);
  const contentO = useTransform(progress, [0.08, 0.28], [0, 1]);

  return (
    <div className="h-full flex items-center justify-center relative pt-16">
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-krato/[0.06] blur-[120px]" />
      <motion.div style={{ scale: contentS, opacity: contentO }} className="relative max-w-4xl mx-auto px-6 text-center z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-5 leading-tight">
          Your marketing data already<br />knows the answer.
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 mb-3">KratoBot helps you see it.</p>
        <p className="text-zinc-500 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
          Start analyzing your brand, competitors, and market positioning today with intelligent, visual reports.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Btn href="/signup">
            Get Started Free
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Btn>
          <Btn href="/login" variant="ghost">Log In</Btn>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] py-10 bg-dark-950">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="" className="w-5 h-5" draggable={false} />
          <span className="text-sm font-display font-bold text-zinc-500">KratoBot</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-zinc-600">
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollToProgress(0.27); }} className="hover:text-zinc-300 transition cursor-pointer">Features</a>
          <a href="#how" onClick={(e) => { e.preventDefault(); scrollToProgress(0.47); }} className="hover:text-zinc-300 transition cursor-pointer">How it Works</a>
          <Link href="/login" className="hover:text-zinc-300 transition">Login</Link>
          <Link href="/signup" className="hover:text-zinc-300 transition">Sign Up</Link>
        </div>
        <p className="text-xs text-zinc-700">&copy; 2026 KratoBot. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN HOMEPAGE

   Architecture (proven sticky + spacer pattern):
   - position: sticky container pinned at top, h-screen
   - 500vh scroll spacer creates 5 screen-heights of scroll
   - Layers are absolute inside the sticky container
   - useScroll() tracks PAGE scroll (no internal container)
   - No useSpring → instant scroll sync
   - clamp: false → correct opacity extrapolation
   - Footer sits in normal flow after the spacer
   ═══════════════════════════════════════════════════ */
export default function ScrollHomepage() {
  const { scrollYProgress } = useScroll();

  // Divide total page scroll into 5 equal segments
  const s1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const s2 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const s3 = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const s4 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const s5 = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  // Only paint layers inside (or near) their scroll segment
  const heroActive = useActiveSegment(scrollYProgress, 0, 0.2);
  const capActive = useActiveSegment(scrollYProgress, 0.2, 0.4);
  const flowActive = useActiveSegment(scrollYProgress, 0.4, 0.6);
  const metricsActive = useActiveSegment(scrollYProgress, 0.6, 0.8);
  const ctaActive = useActiveSegment(scrollYProgress, 0.8, 1);

  return (
    <div className="bg-dark-950 text-white">
      <Nav />

      {/* Sticky viewport — pinned while spacer scrolls past */}
      <div className="sticky top-0 h-screen w-full" style={{ zIndex: 1 }}>
        {/* Hero: base layer — always rendered, fades on scroll */}
        <HeroLayer progress={s1} active={heroActive} />

        {/* Overlay layers: each covers the previous via z-index */}
        <OverlaySection progress={s2} zIndex={10} id="features" active={capActive}>
          <CapabilitiesContent progress={s2} />
        </OverlaySection>

        <OverlaySection progress={s3} zIndex={20} id="how" active={flowActive}>
          <FlowContent progress={s3} />
        </OverlaySection>

        <OverlaySection progress={s4} zIndex={30} active={metricsActive}>
          <MetricsContent progress={s4} />
        </OverlaySection>

        <OverlaySection progress={s5} zIndex={40} active={ctaActive}>
          <CTAContent progress={s5} />
        </OverlaySection>
      </div>

      {/* Scroll spacer: 5 × screen height */}
      <div className="h-[500vh]" />

      {/* Footer: appears after all scroll sections */}
      <Footer />
    </div>
  );
}
