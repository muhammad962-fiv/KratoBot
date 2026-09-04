/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // MarkdownRenderer.tsx lives here — without this glob its prose-* classes
    // get purged and report content renders as unstyled plain text
    "./styles/**/*.{js,ts,jsx,tsx}",
    "./styles/globals.css"
  ],
  theme: {
    extend: {
      colors: {
        /* ── Brand ── */
        krato: {
          DEFAULT: "#408CF1",
          light: "#72B3F6",
          dark: "#2563EB",
          glow: "rgba(64,140,241,0.35)",
          muted: "rgba(64,140,241,0.12)",
        },

        /* ── Dark foundation (homepage, report) ── */
        dark: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },

        /* ── Light foundation (dashboard) ── */
        light: {
          bg: "#fafafa",
          surface: "#ffffff",
          card: "#f4f4f5",
          border: "rgba(0,0,0,0.06)",
          borderHover: "rgba(64,140,241,0.25)",
        },

        /* ── Glass surfaces ── */
        glass: {
          DEFAULT: "rgba(255,255,255,0.04)",
          hover: "rgba(255,255,255,0.07)",
          light: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.08)",
          borderHover: "rgba(255,255,255,0.15)",
        },

        /* ── Legacy compat ── */
        neu: {
          bg: "#f5f6fa",
          surface: "#edf0f7",
          edge: "#e3e6ed",
          shadow: "#babec5",
          text: "#2d3748",
        },
      },

      /* ── Shadows ── */
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.25)",
        glow: "0 0 40px rgba(64,140,241,0.15)",
        "glow-lg": "0 0 80px rgba(64,140,241,0.25)",
        elevate: "0 8px 30px rgba(0,0,0,0.08)",
        "elevate-lg": "0 12px 40px rgba(0,0,0,0.12)",
        "elevate-hover": "0 16px 48px rgba(0,0,0,0.16)",
        neu: "8px 8px 16px #babec5, -8px -8px 16px #fff",
        neuInset: "inset 8px 8px 16px #babec5, inset -8px -8px 16px #fff",
      },

      /* ── Radius ── */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        neu: "2rem",
      },

      /* ── Typography ── */
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Rubik"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      },

      /* ── Animations ── */
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(2deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },

      /* ── Transitions ── */
      transitionDuration: {
        fast: "200ms",
        slow: "700ms",
      },

      /* ── Typography plugin ── */
      typography: (theme) => ({
        invert: {
          css: {
            "--tw-prose-body": theme("colors.zinc[300]"),
            "--tw-prose-headings": theme("colors.white"),
            "--tw-prose-bold": theme("colors.white"),
            "--tw-prose-links": theme("colors.krato.DEFAULT"),
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
