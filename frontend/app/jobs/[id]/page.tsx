"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useJob } from "@/hooks/useJobs";
import { useMe } from "@/hooks/useMe";
import { useEffect } from "react";

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  CREATED:   { label: "Created",   color: "text-muted",       bg: "bg-muted/20",       dot: "bg-zinc-400" },
  QUEUED:    { label: "Queued",    color: "text-info",        bg: "bg-info/10",        dot: "bg-info" },
  RUNNING:   { label: "Running",   color: "text-warning",     bg: "bg-warning/10",     dot: "bg-warning" },
  COMPLETED: { label: "Completed", color: "text-success",     bg: "bg-success/10",     dot: "bg-success" },
  FAILED:    { label: "Failed",    color: "text-destructive", bg: "bg-destructive/10", dot: "bg-destructive" },
};

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;

  if (!jobId || Array.isArray(jobId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted">Invalid job id</p>
      </div>
    );
  }

  const { isLoading: userLoading, error: userError } = useMe();
  const { data, isLoading, isError } = useJob(jobId);

  useEffect(() => {
    if (userError) {
      router.push("/login");
    }
  }, [userError, router]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-destructive">Failed to load job details.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const job = data.data;
  const status = statusConfig[job.status] || statusConfig.CREATED;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Title section */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">
                {job.title}
              </h1>
              <p className="text-sm text-muted mt-1">
                Job ID: <code className="text-xs bg-card px-1.5 py-0.5 rounded border border-border font-mono">{job.id}</code>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${status.color} ${status.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${job.status === "RUNNING" ? "animate-pulse" : ""}`} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Type",
              value: job.type,
            },
            {
              label: "Status",
              value: status.label,
            },
            {
              label: "Created",
              value: new Date(job.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            },
            {
              label: "Retries",
              value: `${job.retryCount || 0}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl border border-border bg-card hover:border-accent/20 transition-colors"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-sm font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Timestamps */}
        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
          <h3 className="text-sm font-semibold">Timeline</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
              <span className="text-muted-foreground w-20 shrink-0">Created</span>
              <span>{new Date(job.createdAt).toLocaleString()}</span>
            </div>
            {job.startedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-warning shrink-0" />
                <span className="text-muted-foreground w-20 shrink-0">Started</span>
                <span>{new Date(job.startedAt).toLocaleString()}</span>
              </div>
            )}
            {job.completedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full shrink-0 ${job.status === "FAILED" ? "bg-destructive" : "bg-success"}`} />
                <span className="text-muted-foreground w-20 shrink-0">
                  {job.status === "FAILED" ? "Failed" : "Completed"}
                </span>
                <span>{new Date(job.completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {job.status === "COMPLETED" && job.result && (
          <div className="p-4 rounded-xl border border-border bg-card space-y-4">
            <h3 className="text-sm font-semibold">Results</h3>

            {job.type === "IMAGE" ? (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center p-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${job.result.compressedPath}`}
                    alt={job.title}
                    className="max-h-[500px] w-auto object-contain rounded"
                  />
                </div>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${job.result.compressedPath}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 text-white text-sm font-medium rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Compressed Image
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Pages</p>
                    <p className="text-xl font-bold mt-1">{job.result.pages}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Characters</p>
                    <p className="text-xl font-bold mt-1">{job.result.textLength?.toLocaleString()}</p>
                  </div>
                </div>

                {job.result.preview && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Text Preview
                    </p>
                    <div className="p-4 rounded-lg bg-background border border-border font-mono text-sm text-muted leading-relaxed whitespace-pre-wrap">
                      {job.result.preview}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {job.status === "FAILED" && job.error && (
          <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-2">
            <h3 className="text-sm font-semibold text-destructive">Error</h3>
            <p className="text-sm text-muted font-mono">{job.error}</p>
          </div>
        )}
      </main>
    </div>
  );
}