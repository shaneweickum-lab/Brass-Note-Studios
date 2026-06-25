"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { CheckCircle, AlertCircle, Send } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  serviceType: string;
  description: string;
};

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service..." },
  { value: "Individual Commissions", label: "Individual — Birthdays, Anniversaries, Weddings & More (from $149)" },
  { value: "Organization Commissions", label: "Organization — Churches, Nonprofits, Schools & Businesses (from $199)" },
  { value: "Content Creator Commissions", label: "Content Creator — Tracks, Podcast Themes & Social Music (from $75)" },
  { value: "Subscription", label: "Subscription Plan — Ongoing music with priority scheduling" },
  { value: "Other", label: "Not sure / Other" },
];

interface ContactFormProps {
  defaultService?: string;
}

export default function ContactForm({ defaultService = "" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: { serviceType: defaultService },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    try {
      const res = await fetch("https://formspree.io/f/xkoljkey", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-surface border border-gold/20 rounded-lg p-10 text-center">
        <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
        <h3 className="font-display text-2xl text-text-base mb-3">
          Message Received!
        </h3>
        <p className="text-text-muted font-body leading-relaxed max-w-sm mx-auto">
          Thank you for reaching out. We'll review your project and get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-gold hover:text-gold-light font-body text-sm underline transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {/* Name */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="name">
          Full Name <span className="text-gold">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          {...register("name", { required: "Please enter your name" })}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="email">
          Email Address <span className="text-gold">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Please enter your email address",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" },
          })}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="serviceType">
          Service Type <span className="text-gold">*</span>
        </label>
        <select
          id="serviceType"
          {...register("serviceType", { required: "Please select a service type" })}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors appearance-none"
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.serviceType && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.serviceType.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="description">
          Project Description <span className="text-gold">*</span>
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Tell us about your project — who it's for, the occasion, the mood or style you're imagining, any specific stories or lyric ideas..."
          {...register("description", { required: "Please describe your project" })}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.description.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-sm font-body bg-red-400/10 rounded-sm px-4 py-3 border border-red-400/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Something went wrong. Please try again or email directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-background font-body font-semibold px-8 py-4 rounded-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        <Send className="w-4 h-4" />
        {status === "submitting" ? "Sending…" : "Send My Request"}
      </button>
    </form>
  );
}
