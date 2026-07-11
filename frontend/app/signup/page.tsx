"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";
import { useSignup } from "@/hooks/useSignup";

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
            });
        };
        return (
             <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

      <button type="submit" disabled={signup.isPending}>
        {signup.isPending ? "Signing up..." : "Sign Up"}
      </button>

      {signup.isError && (
        <p>Invalid email or password</p>
      )}
    </form>
  );
}