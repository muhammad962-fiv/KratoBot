"use client";
import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
  as?: "div" | "section";
}

export default function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
  delay = 0,
  as = "div",
}: GlassCardProps) {
  const base =
    "rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] transition-all duration-300";
  const hoverCls = hover
    ? "hover:bg-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-glass"
    : "";
  const glowCls = glow ? "glow-krato-sm" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${base} ${hoverCls} ${glowCls} ${className}`}
    >
      {children}
    </motion.div>
  );
}
