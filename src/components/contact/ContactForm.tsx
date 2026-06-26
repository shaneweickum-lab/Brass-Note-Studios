"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Send, ShoppingCart } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  serviceType: string;
  packageName: string;
  songTitle: string;
  genreOrReference: string;
  whoIsItFor: string;
  storyOrLyrics: string;
  songLength: string;
  vocalType: string;
  vocalStyle: string;
};

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service..." },
  { value: "Individual Commissions", label: "Individual — Birthdays, Anniversaries, Weddings & More (from $149)" },
  { value: "Organization Commissions", label: "Organization — Churches, Nonprofits, Schools & Businesses (from $199)" },
  { value: "Content Creator Commissions", label: "Content Creator — Tracks, Podcast Themes & Social Music (from $75)" },
  { value: "Subscription", label: "Subscription Plan — Ongoing music with priority scheduling" },
  { value: "Other", label: "Not sure / Other" },
];

const WHO_OPTIONS = [
  { value: "Self", label: "Myself" },
  { value: "Gift", label: "A gift for someone" },
  { value: "Campaign", label: "A campaign" },
  { value: "Commercial", label: "Commercial use" },
  { value: "Content", label: "Content creation" },
];

const LENGTH_OPTIONS = [
  {
    value: "short",
    label: "Short",
    structure: "Intro · 2 Verses · Chorus · Outro",
  },
  {
    value: "medium",
    label: "Medium",
    structure: "Intro · 2 Verses · Chorus · Bridge · Outro",
  },
  {
    value: "long",
    label: "Long",
    structure: "Intro · 3 Verses · Chorus · Bridge · Outro",
  },
];

const VOCAL_TYPE_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const VOCAL_STYLE_OPTIONS = [
  { value: "Pop", label: "Pop" },
  { value: "R&B", label: "R&B" },
  { value: "Rock", label: "Rock" },
  { value: "Intimate", label: "Intimate / Love Song" },
  { value: "Spoken Word", label: "Spoken Word" },
  { value: "Punk", label: "Punk" },
  { value: "Metal", label: "Metal" },
  { value: "Operatic", label: "Operatic" },
  { value: "Mixture", label: "Mixture / Blend" },
];

interface ContactFormProps {
  defaultService?: string;
  packageName?: string;
  checkoutUrl?: string;
}

// Shared radio pill class builders
function pillBase(selected: boolean) {
  return `cursor-pointer select-none rounded-sm px-4 py-2.5 font-body text-sm font-medium border transition-colors duration-150 ${
    selected
      ? "bg-gold text-background border-gold"
      : "bg-surface border-white/10 text-text-muted hover:border-gold/40 hover:text-text-base"
  }`;
}

export default function ContactForm({ defaultService = "", packageName = "", checkoutUrl = "" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [countdown, setCountdown] = useState(3);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      serviceType: defaultService,
      packageName,
      whoIsItFor: "",
      songLength: "",
      vocalType: "",
      vocalStyle: "",
      songTitle: "",
      genreOrReference: "",
      storyOrLyrics: "",
    },
  });

  const whoIsItFor = watch("whoIsItFor");
  const songLength  = watch("songLength");
  const vocalType   = watch("vocalType");
  const vocalStyle  = watch("vocalStyle");

  // Countdown + redirect after successful submit when a checkout URL is present
  useEffect(() => {
    if (status !== "success" || !checkoutUrl) return;
    if (countdown <= 0) {
      window.location.href = checkoutUrl;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, checkoutUrl, countdown]);

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
    if (checkoutUrl) {
      return (
        <div className="bg-surface border border-gold/20 rounded-lg p-10 text-center">
          <ShoppingCart className="w-12 h-12 text-gold mx-auto mb-4" />
          <h3 className="font-display text-2xl text-text-base mb-3">Request Received!</h3>
          <p className="text-text-muted font-body leading-relaxed max-w-sm mx-auto mb-6">
            Your project details have been sent. We'll follow up within 1–2 business days.
            Taking you to checkout now…
          </p>
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-sm px-6 py-3 text-gold font-body text-sm font-semibold">
            <span className="w-6 h-6 rounded-full bg-gold text-background text-xs flex items-center justify-center font-bold">
              {countdown}
            </span>
            Redirecting to checkout in {countdown}s
          </div>
          <div className="mt-4">
            <a href={checkoutUrl} className="text-gold/60 hover:text-gold font-body text-xs underline transition-colors">
              Click here if not redirected automatically
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-surface border border-gold/20 rounded-lg p-10 text-center">
        <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
        <h3 className="font-display text-2xl text-text-base mb-3">Message Received!</h3>
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7" noValidate>

      {/* Selected package banner */}
      {packageName && (
        <div className="flex items-center gap-3 bg-gold/8 border border-gold/20 rounded-sm px-4 py-3">
          <ShoppingCart className="w-4 h-4 text-gold shrink-0" />
          <div>
            <p className="text-gold font-body text-xs font-semibold uppercase tracking-wide">Selected Package</p>
            <p className="text-text-base font-body text-sm">{packageName}{defaultService ? ` — ${defaultService}` : ""}</p>
          </div>
        </div>
      )}

      {/* ── Section: About You ── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">About You</legend>

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

        {/* Who is this for */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Who is this song for? <span className="text-gold">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {WHO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("whoIsItFor", opt.value, { shouldValidate: true })}
                className={pillBase(whoIsItFor === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("whoIsItFor", { required: "Please select who this song is for" })} />
          {errors.whoIsItFor && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.whoIsItFor.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className="border-t border-white/5" />

      {/* ── Section: The Song ── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">The Song</legend>

        {/* Song Title (optional) */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="songTitle">
            Song Title{" "}
            <span className="text-text-subtle font-normal">(optional — can be decided after)</span>
          </label>
          <input
            id="songTitle"
            type="text"
            placeholder="Leave blank if you'd like us to title it"
            {...register("songTitle")}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>

        {/* Genre / Sound Reference */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="genreOrReference">
            Genre or Sound Reference{" "}
            <span className="text-text-subtle font-normal">(optional)</span>
          </label>
          <input
            id="genreOrReference"
            type="text"
            placeholder='e.g. "Soul / R&B" or "Sounds like Adele meets John Legend"'
            {...register("genreOrReference")}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
          />
          <p className="mt-1.5 text-text-subtle font-body text-xs leading-relaxed">
            Don't know the genre? Name artists or songs that capture the vibe — that's just as helpful.
          </p>
        </div>

        {/* Story / Memory / Lyrics */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="storyOrLyrics">
            Story, Memory, or Your Own Lyrics <span className="text-gold">*</span>
          </label>
          <textarea
            id="storyOrLyrics"
            rows={7}
            placeholder="Share the story or memory you want captured — who it's about, what happened, what you want to feel when you hear it. Or, if you have your own writing (a poem, diary entry, song draft, or anything else), paste it right here and we'll set it to music."
            {...register("storyOrLyrics", { required: "Please share the story, memory, or lyrics for this song" })}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
          />
          {errors.storyOrLyrics && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.storyOrLyrics.message}
            </p>
          )}
        </div>

        {/* Song Length */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Song Length <span className="text-gold">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("songLength", opt.value, { shouldValidate: true })}
                className={`flex-1 rounded-sm border px-4 py-3 text-left transition-colors duration-150 cursor-pointer ${
                  songLength === opt.value
                    ? "bg-gold/10 border-gold text-text-base"
                    : "bg-surface border-white/10 text-text-muted hover:border-gold/40"
                }`}
              >
                <p className={`font-body font-semibold text-sm mb-1 ${songLength === opt.value ? "text-gold" : ""}`}>
                  {opt.label}
                </p>
                <p className="font-body text-xs text-text-subtle leading-relaxed">{opt.structure}</p>
              </button>
            ))}
          </div>
          <input type="hidden" {...register("songLength", { required: "Please select a song length" })} />
          {errors.songLength && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.songLength.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className="border-t border-white/5" />

      {/* ── Section: Vocals ── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">Vocals</legend>

        {/* Vocal Type */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Vocal Type <span className="text-gold">*</span>
          </label>
          <div className="flex gap-3">
            {VOCAL_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("vocalType", opt.value, { shouldValidate: true })}
                className={pillBase(vocalType === opt.value) + " flex-1 justify-center flex"}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("vocalType", { required: "Please select a vocal type" })} />
          {errors.vocalType && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.vocalType.message}
            </p>
          )}
        </div>

        {/* Vocal Style */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Vocal Style <span className="text-gold">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {VOCAL_STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("vocalStyle", opt.value, { shouldValidate: true })}
                className={pillBase(vocalStyle === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("vocalStyle", { required: "Please select a vocal style" })} />
          {errors.vocalStyle && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.vocalStyle.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Hidden fields sent to Formspree */}
      <input type="hidden" {...register("packageName")} />

      <div className="border-t border-white/5 pt-2" />

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-sm font-body bg-red-400/10 rounded-sm px-4 py-3 border border-red-400/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Something went wrong. Please try again or email directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-background font-body font-semibold px-8 py-4 rounded-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {status === "submitting" ? "Sending…" : checkoutUrl ? "Submit & Proceed to Checkout" : "Send My Request"}
      </button>

      {checkoutUrl && (
        <p className="text-text-subtle font-body text-xs text-center leading-relaxed">
          You'll be redirected to complete your purchase after submitting.
        </p>
      )}
    </form>
  );
}
