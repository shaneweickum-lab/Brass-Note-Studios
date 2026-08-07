"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { CheckCircle, AlertCircle, Send } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

const TOPICS = [
  { value: "Pricing",           label: "Pricing & Packages" },
  { value: "Process",           label: "The Process" },
  { value: "Styles & Genres",   label: "Styles & Genres" },
  { value: "Turnaround",        label: "Turnaround Time" },
  { value: "Ownership & Rights",label: "Ownership & Rights" },
  { value: "General",           label: "General Question" },
];

export default function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedTopic, setSelectedTopic] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({ defaultValues: { topic: "" } });

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    try {
      const res = await fetch("https://formspree.io/f/xkoljkey", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, _formType: "inquiry" }),
      });
      if (res.ok) {
        setStatus("success");
        reset();
        setSelectedTopic("");
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
        <h3 className="font-display text-2xl text-text-base mb-3">Question Received!</h3>
        <p className="text-text-muted font-body leading-relaxed max-w-sm mx-auto">
          We'll get back to you within 1–2 business days. No pressure — just an honest conversation.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-gold hover:text-gold-light font-body text-sm underline transition-colors"
        >
          Ask another question
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

      {/* Name */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="inquiry-name">
          Full Name <span className="text-gold">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          placeholder="Your name"
          {...register("name", { required: "Please enter your name" })}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="inquiry-email">
          Email Address <span className="text-gold">*</span>
        </label>
        <input
          id="inquiry-email"
          type="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Please enter your email address",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" },
          })}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>
        )}
      </div>

      {/* Topic */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-2">
          What are you curious about? <span className="text-text-subtle font-normal">(optional)</span>
        </label>
        <input type="hidden" {...register("topic")} />
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                const next = selectedTopic === t.value ? "" : t.value;
                setSelectedTopic(next);
                setValue("topic", next);
              }}
              className={`cursor-pointer select-none rounded-sm px-3 py-2 font-body text-sm border transition-colors duration-150 ${
                selectedTopic === t.value
                  ? "bg-gold text-background border-gold"
                  : "bg-surface border-white/10 text-text-muted hover:border-gold/40 hover:text-text-base"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="inquiry-message">
          Your Question <span className="text-gold">*</span>
        </label>
        <textarea
          id="inquiry-message"
          rows={5}
          placeholder="Ask us anything — about the process, what's possible, how it works, or anything else on your mind."
          {...register("message", { required: "Please enter your question or message" })}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.message.message}</p>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-sm font-body bg-red-400/10 rounded-sm px-4 py-3 border border-red-400/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Something went wrong. Please try again or email us at{" "}
          <a href="mailto:support@brassnotestudios.com" className="underline hover:text-red-300">support@brassnotestudios.com</a>.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center justify-center gap-2 bg-surface hover:bg-surface-elevated border border-gold/40 hover:border-gold text-gold font-body font-semibold px-8 py-4 rounded-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {status === "submitting" ? "Sending…" : "Send My Question"}
      </button>
    </form>
  );
}
