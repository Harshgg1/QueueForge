"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UploadImage from "@/components/UploadImage";
import UploadPdf from "@/components/UploadPdf";
import { useJobs } from "@/hooks/useJobs";
import { useMe } from "@/hooks/useMe";
import { useLogout } from "@/hooks/useLogout";
import { Workflow, Loader2, Image as ImageIcon, FileText, FileSpreadsheet, ChevronRight, FolderOpen, LogOut } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  CREATED:   { label: "Created",   color: "text-muted-foreground", bg: "bg-zinc-800/50", dot: "bg-zinc-400" },
  QUEUED:    { label: "Queued",    color: "text-blue-400",         bg: "bg-blue-500/10", dot: "bg-blue-400" },
  RUNNING:   { label: "Running",   color: "text-yellow-400",       bg: "bg-yellow-500/10", dot: "bg-yellow-400" },
  COMPLETED: { label: "Completed", color: "text-emerald-400",      bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  FAILED:    { label: "Failed",    color: "text-red-400",          bg: "bg-red-500/10", dot: "bg-red-400" },
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  IMAGE: { label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
  PDF:   { label: "PDF",   icon: <FileText className="w-4 h-4" /> },
  CSV:   { label: "CSV",   icon: <FileSpreadsheet className="w-4 h-4" /> },
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (userError) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">QueueForge</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs font-semibold">
                {user?.data?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:inline">{user?.data?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="p-1.5 text-muted hover:text-foreground border border-transparent hover:border-border hover:bg-card rounded-md transition-all disabled:opacity-50"
              title="Log out"
            >
              {logout.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.data?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload files and track your processing jobs.
          </p>
        </div>

        {/* Upload section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card hover:border-zinc-700 transition-colors space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <ImageIcon className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Upload Image</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Compress and resize images automatically.
            </p>
            <UploadImage />
          </div>

          <div className="p-4 rounded-xl border border-border bg-card hover:border-zinc-700 transition-colors space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <FileText className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Upload PDF</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Extract text and metadata from PDF files.
            </p>
            <UploadPdf />
          </div>
        </div>

        {/* Jobs section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Your Jobs</h2>
            {data?.jobs?.length > 0 && (
              <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-zinc-900 border border-border">
                {data.jobs.length} job{data.jobs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-sm text-destructive">Failed to load jobs.</p>
            </div>
          ) : data.jobs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-card border border-border mx-auto mb-4 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No jobs yet</p>
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
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                        {type.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{job.title}</p>
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border/50 ${status.color} ${status.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${job.status === "RUNNING" ? "animate-pulse" : ""}`} />
                        {status.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-150" />
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