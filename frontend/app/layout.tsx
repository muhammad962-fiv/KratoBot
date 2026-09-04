import type { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "KratoBot — AI Marketing Intelligence",
  description:
    "Turn marketing data into decisions. KratoBot is your AI-powered marketing intelligence platform for competitive analysis, brand insights, and actionable reports.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <head>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen antialiased selection:bg-krato/25 selection:text-white">
        {children}
      </body>
    </html>
  );
}
