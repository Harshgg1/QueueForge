"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { Workflow, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-background">
      <div className="w-full max-w-sm space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">QueueForge</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

          {login.isError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Invalid email or password
            </div>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full py-2.5 bg-foreground text-background hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-all"
          >
            {login.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground hover:text-muted-foreground font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}