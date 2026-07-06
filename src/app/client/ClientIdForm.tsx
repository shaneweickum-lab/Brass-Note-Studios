"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ClientIdForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value.toUpperCase());
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clientId = value.trim();
    if (!clientId) {
      setError("Please enter your Client ID.");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/client/${encodeURIComponent(clientId)}`);

      if (res.ok) {
        router.push(`/client/${encodeURIComponent(clientId)}`);
        return;
      }

      if (res.status === 404) {
        setError(
          "We couldn't find that Client ID. Please check the ID you received from the studio and try again."
        );
      } else if (res.status === 429) {
        setError("Too many attempts. Please wait a moment and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="BNS011526C0001"
          autoComplete="off"
          spellCheck={false}
          disabled={loading}
          className="
            w-full px-4 py-3
            bg-surface border border-white/8
            font-mono text-base tracking-widest uppercase
            text-text-base placeholder:text-text-subtle
            rounded-sm
            transition-colors duration-200
            focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        {error && (
          <p className="text-sm font-body text-red-400 leading-relaxed">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-3 px-6
          bg-gold text-background
          font-body font-semibold text-base tracking-wide
          rounded-sm
          transition-all duration-200
          hover:bg-gold-light
          focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Looking up your commission…" : "View My Commission"}
      </button>
    </form>
  );
}
