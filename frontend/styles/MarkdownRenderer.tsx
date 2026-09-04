"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* Explicit element styling — each node gets its own Tailwind classes rather than
   relying only on `prose-*` variants, so report formatting is guaranteed. */
export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="max-w-none text-[15px] leading-7 text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* ── Headings ── */
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-10 mb-4 pb-3 border-b border-white/[0.08]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-display font-bold text-white mt-9 mb-4">
              <span className="w-1 h-6 rounded-full bg-krato shrink-0" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-display font-semibold text-krato-light mt-7 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-zinc-100 mt-5 mb-2">
              {children}
            </h4>
          ),

          /* ── Text ── */
          p: ({ children }) => (
            <p className="text-zinc-300 leading-7 mb-4">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-200">{children}</em>
          ),
          hr: () => <hr className="my-8 border-white/[0.08]" />,

          /* ── Links: distinct colour + safe external opening ── */
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-krato font-medium underline decoration-krato/30 hover:decoration-krato underline-offset-2 hover:text-krato-light transition-colors break-words"
            >
              {children}
            </a>
          ),

          /* ── Lists (native markers keep ol numbering correct) ── */
          ul: ({ children }) => (
            <ul className="my-4 space-y-2 pl-6 list-disc marker:text-krato">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 space-y-2 pl-6 list-decimal marker:text-krato marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-zinc-300 leading-7 pl-1">{children}</li>
          ),

          /* ── Code ── */
          code: ({ className, children }) => {
            const isBlock = Boolean(className);
            return isBlock ? (
              <code className={`${className ?? ""} text-sm text-zinc-200`}>
                {children}
              </code>
            ) : (
              <code className="px-1.5 py-0.5 rounded-md bg-krato/10 border border-krato/20 text-krato text-[13px] font-mono">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-5 p-4 rounded-xl bg-black/40 border border-white/[0.08] overflow-x-auto text-sm">
              {children}
            </pre>
          ),

          /* ── Blockquote ── */
          blockquote: ({ children }) => (
            <blockquote className="my-5 pl-4 py-1 border-l-2 border-krato/50 bg-krato/[0.04] rounded-r-lg text-zinc-400 italic">
              {children}
            </blockquote>
          ),

          /* ── Tables ── */
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-white/[0.08]">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/[0.04]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-white border-b border-white/[0.08] whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-zinc-300 border-b border-white/[0.05]">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
