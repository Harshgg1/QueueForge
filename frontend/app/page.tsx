"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">JobFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm bg-accent hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 text-white rounded-lg font-medium transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div
          className={`max-w-3xl mx-auto text-center space-y-8 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Open Source &middot; Built with BullMQ + Redis
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            Distributed Job
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Processing Platform
            </span>
          </h1>

          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Upload images and PDFs. Process them asynchronously with distributed
            workers. Track every job in real-time with retries, status updates,
            and results.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              Start Processing
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-border hover:border-accent/50 text-foreground rounded-lg font-medium transition-all hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div
          className={`max-w-4xl mx-auto mt-24 mb-16 grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              title: "Image Compression",
              desc: "Auto-resize and compress images with Sharp",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              title: "PDF Extraction",
              desc: "Parse and extract text from PDF documents",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ),
              title: "Auto Retries",
              desc: "Exponential backoff with configurable retry logic",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-200 group cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-200">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        Built with Next.js, Express, BullMQ, Redis, PostgreSQL &amp; Prisma
      </footer>
    </div>
  );
}
