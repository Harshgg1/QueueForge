"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useJob } from "@/hooks/useJobs";
import { useMe } from "@/hooks/useMe";
import { useEffect } from "react";
import { ChevronLeft, Download, Loader2, ArrowRight } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  CREATED:   { label: "Created",   color: "text-muted-foreground", bg: "bg-zinc-800/50", dot: "bg-zinc-400" },
  QUEUED:    { label: "Queued",    color: "text-blue-400",         bg: "bg-blue-500/10", dot: "bg-blue-400" },
  RUNNING:   { label: "Running",   color: "text-yellow-400",       bg: "bg-yellow-500/10", dot: "bg-yellow-400" },
  COMPLETED: { label: "Completed", color: "text-emerald-400",      bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  FAILED:    { label: "Failed",    color: "text-red-400",          bg: "bg-red-500/10", dot: "bg-red-400" },
};

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;

  if (!jobId || Array.isArray(jobId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Invalid job id</p>
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

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-sm text-destructive">Failed to load job details.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const job = data.data;
  const status = statusConfig[job.status] || statusConfig.CREATED;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group font-medium"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Title section */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">
                {job.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Job ID: <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-border font-mono">{job.id}</code>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border border-border/50 ${status.color} ${status.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${job.status === "RUNNING" ? "animate-pulse" : ""}`} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Type", value: job.type },
            { label: "Status", value: status.label },
            {
              label: "Created",
              value: new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            },
            { label: "Retries", value: `${job.retryCount || 0}` },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl border border-border bg-card hover:border-zinc-700 transition-colors"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {item.label}
              </p>
              <p className="text-sm font-medium mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Results Area */}
          <div className="md:col-span-2 space-y-6">
            {job.status === "COMPLETED" && job.result && (
              <div className="space-y-6">
                
                {job.type === "IMAGE" ? (
                  <div className="space-y-6">
                    {/* Stats Card */}
                    {job.result.originalSize && job.result.compressedSize && (
                      <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Original</p>
                          <p className="text-lg font-mono">{formatBytes(job.result.originalSize)}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Compressed</p>
                          <p className="text-lg font-mono text-emerald-400">{formatBytes(job.result.compressedSize)}</p>
                        </div>
                        <div className="h-10 w-px bg-border mx-4"></div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Saved</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {Math.round(((job.result.originalSize - job.result.compressedSize) / job.result.originalSize) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Side by Side Viewer */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-center">Original Image</p>
                        <div className="rounded-xl overflow-hidden border border-border bg-zinc-950 flex items-center justify-center p-2 h-[400px]">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${job.result.originalPath}`}
                            alt="Original"
                            className="max-h-full w-auto object-contain rounded"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-center text-emerald-400">Compressed Image</p>
                        <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-zinc-950 flex items-center justify-center p-2 h-[400px]">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${job.result.compressedPath}`}
                            alt="Compressed"
                            className="max-h-full w-auto object-contain rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/${job.result.compressedPath}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background hover:bg-zinc-200 hover:-translate-y-px hover:shadow-lg active:scale-95 rounded-lg text-sm font-medium transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download Compressed Image
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pages</p>
                        <p className="text-xl font-bold mt-1">{job.result.pages}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Characters</p>
                        <p className="text-xl font-bold mt-1">{job.result.textLength?.toLocaleString()}</p>
                      </div>
                    </div>

                    {job.result.preview && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                          Text Preview
                        </p>
                        <div className="p-5 rounded-xl bg-zinc-950 border border-border font-mono text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
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
              <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/10 space-y-2">
                <h3 className="text-sm font-semibold text-red-400">Error</h3>
                <p className="text-sm text-red-200 font-mono">{job.error}</p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="md:col-span-1">
            <div className="p-5 rounded-xl border border-border bg-card space-y-4 sticky top-24">
              <h3 className="text-sm font-semibold">Timeline</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-background bg-zinc-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-3 md:pl-0 md:group-even:pl-3 md:group-odd:pr-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">Created</span>
                      <span className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                {job.startedAt && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-background bg-yellow-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-3 md:pl-0 md:group-even:pl-3 md:group-odd:pr-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">Started</span>
                        <span className="text-xs text-muted-foreground">{new Date(job.startedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {job.completedAt && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-3 h-3 rounded-full border-2 border-background ${job.status === "FAILED" ? "bg-red-400" : "bg-emerald-400"} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow`} />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-3 md:pl-0 md:group-even:pl-3 md:group-odd:pr-3">
                      <div className="flex flex-col">
                        <span className={`text-xs font-semibold ${job.status === "FAILED" ? "text-red-400" : "text-emerald-400"}`}>
                          {job.status === "FAILED" ? "Failed" : "Completed"}
                        </span>
                        <span className="text-xs text-muted-foreground">{new Date(job.completedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}