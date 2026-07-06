"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Invalid credentials.");
        return;
      }

      const next = searchParams.get("next") ?? "/admin/portal";
      router.push(next);
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="font-body text-xs text-red-400 text-center bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-1.5">
        <label className="font-body text-xs text-text-subtle uppercase tracking-[0.1em] block">
          Username
        </label>
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(null); }}
          required
          disabled={loading}
          className="
            w-full px-3 py-2.5
            bg-background border border-white/10 rounded
            font-body text-sm text-text-base placeholder:text-text-subtle
            focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30
            disabled:opacity-50 transition-colors
          "
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-body text-xs text-text-subtle uppercase tracking-[0.1em] block">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null); }}
          required
          disabled={loading}
          className="
            w-full px-3 py-2.5
            bg-background border border-white/10 rounded
            font-body text-sm text-text-base placeholder:text-text-subtle
            focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30
            disabled:opacity-50 transition-colors
          "
        />
      </div>

      <button
        type="submit"
        disabled={loading || !username || !password}
        className="
          w-full py-2.5 mt-2
          bg-gold text-background
          font-body text-sm font-semibold tracking-wide
          rounded transition-all
          hover:bg-gold-light
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
