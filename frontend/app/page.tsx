"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Workflow, Image as ImageIcon, FileText, RotateCcw } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">QueueForge</span>
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
              className="px-4 py-2 text-sm bg-foreground text-background hover:bg-zinc-200 rounded-lg font-medium transition-all"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted font-medium bg-card">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Open Source &middot; Built with BullMQ + Redis
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">
            Distributed Job
            <br />
            Processing Platform
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload images and PDFs. Process them asynchronously with distributed
            workers. Track every job in real-time with retries, status updates,
            and results.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="px-6 py-3 bg-foreground text-background hover:bg-zinc-200 hover:-translate-y-px hover:shadow-lg active:scale-95 rounded-lg font-medium transition-all"
            >
              Start Processing
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-border hover:bg-card hover:-translate-y-px hover:shadow-sm active:scale-95 text-foreground rounded-lg font-medium transition-all"
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
              icon: <ImageIcon className="w-5 h-5" />,
              title: "Image Compression",
              desc: "Auto-resize and compress images with Sharp",
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: "PDF Extraction",
              desc: "Parse and extract text from PDF documents",
            },
            {
              icon: <RotateCcw className="w-5 h-5" />,
              title: "Auto Retries",
              desc: "Exponential backoff with configurable retry logic",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl border border-border bg-card hover:border-zinc-700 transition-all duration-200 group cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center mb-3 group-hover:text-foreground transition-all duration-200">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold mb-1 text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
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
