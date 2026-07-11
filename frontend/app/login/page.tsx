"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";
import { useLogin } from "@/hooks/useLogin";

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
            });
        };
        return (
             <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={login.isPending}>
        {login.isPending ? "Logging in..." : "Login"}
      </button>

      {login.isError && (
        <p>Invalid email or password</p>
      )}
    </form>
  );
}