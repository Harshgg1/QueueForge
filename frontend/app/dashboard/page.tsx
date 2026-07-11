"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UploadImage from "@/components/UploadImage";
import UploadPdf from "@/components/UploadPdf";
import { useJobs } from "@/hooks/useJobs";
import { useMe } from "@/hooks/useMe";
import { useLogout } from "@/hooks/useLogout";

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  CREATED:   { label: "Created",   color: "text-muted",       bg: "bg-muted/20",       dot: "bg-zinc-400" },
  QUEUED:    { label: "Queued",    color: "text-info",        bg: "bg-info/10",        dot: "bg-info" },
  RUNNING:   { label: "Running",   color: "text-warning",     bg: "bg-warning/10",     dot: "bg-warning" },
  COMPLETED: { label: "Completed", color: "text-success",     bg: "bg-success/10",     dot: "bg-success" },
  FAILED:    { label: "Failed",    color: "text-destructive", bg: "bg-destructive/10", dot: "bg-destructive" },
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  IMAGE: {
    label: "Image",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  PDF: {
    label: "PDF",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  CSV: {
    label: "CSV",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useMe();

  const {
    data,
    isLoading,
    isError,
  } = useJobs();

  useEffect(() => {
    if (userError) {
      router.replace("/login");
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
          <span className="text-sm">Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (userError) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">JobFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-semibold">
                {user?.data?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:inline">{user?.data?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="px-3 py-1.5 text-sm text-muted hover:text-foreground border border-border hover:border-accent/50 rounded-lg transition-all disabled:opacity-50"
            >
              {logout.isPending ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Log out"
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.data?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Upload files and track your processing jobs.
          </p>
        </div>

        {/* Upload section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-all space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm font-semibold">Upload Image</h3>
            </div>
            <p className="text-xs text-muted">
              Compress and resize images automatically.
            </p>
            <UploadImage />
          </div>

          <div className="p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-all space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-semibold">Upload PDF</h3>
            </div>
            <p className="text-xs text-muted">
              Extract text and metadata from PDF files.
            </p>
            <UploadPdf />
          </div>
        </div>

        {/* Jobs section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Your Jobs</h2>
            {data?.jobs?.length > 0 && (
              <span className="text-xs text-muted px-2 py-1 rounded-md bg-card border border-border">
                {data.jobs.length} job{data.jobs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-sm text-destructive">Failed to load jobs.</p>
            </div>
          ) : data.jobs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-card border border-border mx-auto mb-4 flex items-center justify-center">
                <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-muted">No jobs yet</p>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-[240px] mx-auto">
                Upload your first image or PDF above to start processing.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.jobs.map((job: any) => {
                const status = statusConfig[job.status] || statusConfig.CREATED;
                const type = typeConfig[job.type] || typeConfig.IMAGE;

                return (
                  <Link
                    href={`/jobs/${job.id}`}
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-105 transition-all duration-200">
                        {type.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{job.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {type.label} &middot;{" "}
                          {new Date(job.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${job.status === "RUNNING" ? "animate-pulse" : ""}`} />
                        {status.label}
                      </span>
                      <svg
                        className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}