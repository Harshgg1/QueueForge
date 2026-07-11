"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignup } from "@/hooks/useSignup";
import { Workflow, AlertCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    signup.mutate(
      { name, email, password },
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get started with QueueForge</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

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

          {signup.isError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Signup failed. Email may already be registered.
            </div>
          )}

          <button
            type="submit"
            disabled={signup.isPending}
            className="w-full py-2.5 bg-foreground text-background hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-all"
          >
            {signup.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:text-muted-foreground font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}