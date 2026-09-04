"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const menu = [
  {
    name: "Projects",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    name: "New Project",
    href: "/dashboard/new",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  /* Report detail pages are dark-themed, so the shared chrome follows suit */
  const isDark = /^\/dashboard\/[^/]+\/reports\/[^/]+/.test(pathname ?? "");

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === "undefined") return;
      const currentY = window.scrollY;

      if (currentY <= 0) {
        setShowHeader(true);
        lastScrollY.current = 0;
        return;
      }

      if (currentY > lastScrollY.current) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-dark-950" : "bg-light-bg"}`}>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed w-72 bg-white border-r border-zinc-200/80 h-screen z-50 flex flex-col shadow-elevate-lg"
          >
            {/* Logo */}
            <div className="p-6 border-b border-zinc-100">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-krato to-krato-dark flex items-center justify-center font-bold text-white text-sm shadow-glow-sm">
                  K
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-zinc-900">KratoBot</h2>
                  <p className="text-xs text-zinc-400">AI Marketing Intelligence</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {menu.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-krato text-white shadow-md shadow-krato/20"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-krato to-krato-dark flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
                <span className="text-sm text-zinc-500">Your Workspace</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <AnimatePresence>
          {showHeader && (
            <motion.header
              key="dashboard-header"
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className={`backdrop-blur-2xl border-b sticky top-0 z-30 ${
                isDark
                  ? "bg-dark-950/80 border-white/[0.08]"
                  : "bg-white/80 border-zinc-200/60"
              }`}
            >
              <div className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-4">
                  {/* Menu Button */}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2 rounded-xl transition-all ${
                      isDark
                        ? "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                        : "bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  {/* Brand */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/logo.svg"
                      alt="KratoBot"
                      className="w-7 h-7"
                      draggable={false}
                    />
                    <span
                      className={`text-lg font-display font-bold tracking-tight select-none ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      KratoBot
                    </span>
                  </div>
                </div>

                {/* Profile */}
                <ProfileMenu />
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("krato_token");
      router.push("/login");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl bg-gradient-to-br from-krato to-krato-dark flex items-center justify-center text-white text-sm font-bold shadow-md shadow-krato/20 hover:shadow-lg hover:shadow-krato/30 transition-all"
      >
        U
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-elevate-lg overflow-hidden"
          >
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-500 text-sm font-medium transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
