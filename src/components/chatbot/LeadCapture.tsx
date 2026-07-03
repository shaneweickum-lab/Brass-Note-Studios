"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  interest?: string;
}

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
}

export default function LeadCapture({ onSubmit }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function handleFormSubmit(data: FormData) {
    setSubmitting(true);
    try {
      await onSubmit(data);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-2 border border-gold/30 bg-surface rounded-sm px-4 py-3">
        <p className="text-gold font-body text-xs tracking-[0.12em] uppercase">
          Thank you — we'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 border border-border-subtle bg-surface rounded-sm px-4 py-4">
      <p className="text-text-muted font-body text-[11px] tracking-[0.1em] uppercase mb-3">
        Leave your details
      </p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-2">
        <div>
          <input
            {...register("name", { required: true })}
            placeholder="Your name"
            className="w-full bg-background border border-border-subtle text-text-base text-sm font-body px-3 py-2 placeholder-text-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
          />
          {errors.name && (
            <p className="text-gold/60 text-[10px] mt-0.5">Name is required</p>
          )}
        </div>
        <div>
          <input
            {...register("email", {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            type="email"
            placeholder="Your email"
            className="w-full bg-background border border-border-subtle text-text-base text-sm font-body px-3 py-2 placeholder-text-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
          />
          {errors.email && (
            <p className="text-gold/60 text-[10px] mt-0.5">Valid email required</p>
          )}
        </div>
        <input
          {...register("interest")}
          placeholder="What are you interested in? (optional)"
          className="w-full bg-background border border-border-subtle text-text-base text-sm font-body px-3 py-2 placeholder-text-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-1 border border-gold/50 text-gold font-body text-[11px] tracking-[0.18em] uppercase px-4 py-2.5 hover:bg-gold/8 hover:border-gold transition-all duration-200 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
