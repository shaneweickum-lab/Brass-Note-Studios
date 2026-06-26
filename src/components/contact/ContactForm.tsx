"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Send, ShoppingCart, ChevronRight, HelpCircle } from "lucide-react";
import servicesDataRaw from "@/data/services.json";

// Build a flat lookup of all packages keyed by "category|packageName"
type PackageMeta = { price: string; checkoutUrl?: string; description: string };
const PACKAGE_MAP: Record<string, PackageMeta> = {};
for (const cat of servicesDataRaw.categories) {
  for (const pkg of cat.packages as Array<{ name: string; price: string; description: string; checkoutUrl?: string }>) {
    PACKAGE_MAP[`${cat.name}|${pkg.name}`] = { price: pkg.price, checkoutUrl: pkg.checkoutUrl, description: pkg.description };
  }
}

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

const CATEGORIES = servicesDataRaw.categories.map((c) => ({
  name: c.name,
  tagline: c.tagline,
  packages: (c.packages as Array<{ name: string; price: string; description: string; checkoutUrl?: string }>),
}));

const WHO_OPTIONS = [
  { value: "Self",       label: "Myself" },
  { value: "Gift",       label: "A gift for someone" },
  { value: "Campaign",   label: "A campaign" },
  { value: "Commercial", label: "Commercial use" },
  { value: "Content",    label: "Content creation" },
];

const LENGTH_OPTIONS = [
  { value: "short",  label: "Short",  structure: "Intro · 2 Verses · Chorus · Outro" },
  { value: "medium", label: "Medium", structure: "Intro · 2 Verses · Chorus · Bridge · Outro" },
  { value: "long",   label: "Long",   structure: "Intro · 3 Verses · Chorus · Bridge · Outro" },
];

const VOCAL_TYPE_OPTIONS = [
  { value: "Male",   label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Both",   label: "Both" },
];

// Styles available for individual selection (shown when Mixture is chosen)
const MIXABLE_STYLES = [
  "Pop", "R&B", "Rock", "Intimate / Love Song",
  "Spoken Word", "Punk", "Metal", "Operatic",
];

const VOCAL_STYLE_OPTIONS = [
  ...MIXABLE_STYLES.map((s) => ({ value: s, label: s })),
  { value: "Mixture", label: "Mixture / Blend" },
];

const UNSURE = "Not Sure";
const UNSURE_NOTE = "No worries — we can discuss and narrow down the perfect options for your song.";

interface ContactFormProps {
  defaultService?: string;
  packageName?: string;
  checkoutUrl?: string;
}

function pillBase(selected: boolean) {
  return `cursor-pointer select-none rounded-sm px-4 py-2.5 font-body text-sm font-medium border transition-colors duration-150 ${
    selected
      ? "bg-gold text-background border-gold"
      : "bg-surface border-white/10 text-text-muted hover:border-gold/40 hover:text-text-base"
  }`;
}

function unsurePill(selected: boolean) {
  return `cursor-pointer select-none rounded-sm px-4 py-2.5 font-body text-sm font-medium border transition-colors duration-150 flex items-center gap-1.5 ${
    selected
      ? "bg-white/10 text-text-base border-white/30"
      : "bg-surface border-white/8 text-text-subtle hover:border-white/20 hover:text-text-muted"
  }`;
}

export default function ContactForm({
  defaultService = "",
  packageName: defaultPackage = "",
  checkoutUrl: propCheckoutUrl = "",
}: ContactFormProps) {
  const [status, setStatus]       = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [countdown, setCountdown] = useState(3);

  // Cascading category → package selection
  const [selectedCategory, setSelectedCategory] = useState(defaultService);
  const [selectedPackage,  setSelectedPackage]  = useState(defaultPackage);
  const [formCheckoutUrl,  setFormCheckoutUrl]  = useState(propCheckoutUrl);
  const effectiveCheckoutUrl = propCheckoutUrl || formCheckoutUrl;

  // Mixture sub-style multi-select
  const [mixStyles, setMixStyles] = useState<string[]>([]);

  const categoryPackages = CATEGORIES.find((c) => c.name === selectedCategory)?.packages ?? [];

  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    setSelectedPackage("");
    setFormCheckoutUrl("");
    setValue("serviceType", catName, { shouldValidate: true });
    setValue("packageName", "",      { shouldValidate: false });
  };

  const handlePackageChange = (pkgName: string) => {
    setSelectedPackage(pkgName);
    const meta = PACKAGE_MAP[`${selectedCategory}|${pkgName}`];
    setFormCheckoutUrl(meta?.checkoutUrl ?? "");
    setValue("packageName", pkgName, { shouldValidate: true });
  };

  const toggleMixStyle = (style: string) => {
    setMixStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      serviceType:      defaultService,
      packageName:      defaultPackage,
      whoIsItFor:       "",
      songLength:       "",
      vocalType:        "",
      vocalStyle:       "",
      songTitle:        "",
      genreOrReference: "",
      storyOrLyrics:    "",
    },
  });

  const whoIsItFor = watch("whoIsItFor");
  const songLength  = watch("songLength");
  const vocalType   = watch("vocalType");
  const vocalStyle  = watch("vocalStyle");

  const isMixture = vocalStyle === "Mixture";

  // If any field is still undecided, skip the checkout redirect — we'll
  // send the link manually after narrowing down the details with the client.
  const hasUnsure = songLength === UNSURE || vocalType === UNSURE || vocalStyle === UNSURE;
  const activeCheckoutUrl = hasUnsure ? "" : effectiveCheckoutUrl;

  // Countdown + redirect after successful submit
  useEffect(() => {
    if (status !== "success" || !activeCheckoutUrl) return;
    if (countdown <= 0) {
      window.location.href = activeCheckoutUrl;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, activeCheckoutUrl, countdown]);

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    // Compose final vocal style string for Formspree
    let finalVocalStyle = data.vocalStyle;
    if (isMixture && mixStyles.length > 0) {
      finalVocalStyle = `Mixture: ${mixStyles.join(", ")}`;
    }
    try {
      const res = await fetch("https://formspree.io/f/xkoljkey", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, vocalStyle: finalVocalStyle }),
      });
      if (res.ok) {
        setStatus("success");
        reset();
        setMixStyles([]);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // ── Success screens ───────────────────────────────────────────────────────────

  if (status === "success") {
    if (activeCheckoutUrl) {
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
            <a href={activeCheckoutUrl} className="text-gold/60 hover:text-gold font-body text-xs underline transition-colors">
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

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7" noValidate>

      {/* Selected package banner (arriving from pricing page) */}
      {propCheckoutUrl && defaultPackage && (
        <div className="flex items-center gap-3 bg-gold/8 border border-gold/20 rounded-sm px-4 py-3">
          <ShoppingCart className="w-4 h-4 text-gold shrink-0" />
          <div>
            <p className="text-gold font-body text-xs font-semibold uppercase tracking-wide">Selected Package</p>
            <p className="text-text-base font-body text-sm">{defaultPackage}{defaultService ? ` — ${defaultService}` : ""}</p>
          </div>
        </div>
      )}

      {/* ── About You ── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">About You</legend>

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
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>
          )}
        </div>

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
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Who is this song for? <span className="text-gold">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {WHO_OPTIONS.map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => setValue("whoIsItFor", opt.value, { shouldValidate: true })}
                className={pillBase(whoIsItFor === opt.value)}
              >{opt.label}</button>
            ))}
          </div>
          <input type="hidden" {...register("whoIsItFor", { required: "Please select who this song is for" })} />
          {errors.whoIsItFor && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.whoIsItFor.message}</p>
          )}
        </div>
      </fieldset>

      <div className="border-t border-white/5" />

      {/* ── Service & Package ── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">Service & Package</legend>

        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Commission Type <span className="text-gold">*</span>
          </label>
          <input type="hidden" {...register("serviceType", { required: "Please select a commission type" })} />
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.name} type="button" onClick={() => handleCategoryChange(cat.name)}
                className={`flex items-center justify-between w-full rounded-sm border px-4 py-3 text-left transition-colors duration-150 ${
                  selectedCategory === cat.name ? "bg-gold/10 border-gold" : "bg-surface border-white/10 hover:border-gold/40"
                }`}
              >
                <div>
                  <p className={`font-body font-semibold text-sm ${selectedCategory === cat.name ? "text-gold" : "text-text-base"}`}>{cat.name}</p>
                  <p className="font-body text-xs text-text-subtle mt-0.5">{cat.tagline}</p>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${selectedCategory === cat.name ? "text-gold" : "text-text-subtle"}`} />
              </button>
            ))}
          </div>
          {errors.serviceType && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.serviceType.message}</p>
          )}
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-text-muted font-body text-sm font-medium mb-2">
              Package <span className="text-gold">*</span>
            </label>
            <input type="hidden" {...register("packageName", { required: "Please select a package" })} />
            <div className="flex flex-col gap-2">
              {categoryPackages.map((pkg) => {
                const isSelected = selectedPackage === pkg.name;
                return (
                  <button key={pkg.name} type="button" onClick={() => handlePackageChange(pkg.name)}
                    className={`flex items-center justify-between w-full rounded-sm border px-4 py-3 text-left transition-colors duration-150 ${
                      isSelected ? "bg-gold/10 border-gold" : "bg-surface border-white/10 hover:border-gold/40"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-body font-semibold text-sm ${isSelected ? "text-gold" : "text-text-base"}`}>{pkg.name}</p>
                        {pkg.checkoutUrl && (
                          <span className="text-[10px] font-body font-semibold uppercase tracking-wide bg-gold/15 text-gold px-1.5 py-0.5 rounded-sm">Order Now</span>
                        )}
                      </div>
                      <p className="font-body text-xs text-text-subtle mt-0.5">{pkg.description}</p>
                    </div>
                    <span className={`font-display text-base ml-4 whitespace-nowrap shrink-0 ${isSelected ? "text-gold" : "text-text-muted"}`}>
                      {pkg.price}+
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.packageName && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.packageName.message}</p>
            )}
            {formCheckoutUrl && !propCheckoutUrl && (
              <p className="mt-2 text-text-subtle font-body text-xs flex items-center gap-1.5">
                <ShoppingCart className="w-3 h-3 text-gold shrink-0" />
                After submitting your brief you'll be taken directly to checkout for this package.
              </p>
            )}
          </div>
        )}
      </fieldset>

      <div className="border-t border-white/5" />

      {/* ── The Song ── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">The Song</legend>

        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="songTitle">
            Song Title <span className="text-text-subtle font-normal">(optional — can be decided after)</span>
          </label>
          <input
            id="songTitle" type="text"
            placeholder="Leave blank if you'd like us to title it"
            {...register("songTitle")}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="genreOrReference">
            Genre or Sound Reference <span className="text-text-subtle font-normal">(optional)</span>
          </label>
          <input
            id="genreOrReference" type="text"
            placeholder='e.g. "Soul / R&B" or "Sounds like Adele meets John Legend"'
            {...register("genreOrReference")}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors"
          />
          <p className="mt-1.5 text-text-subtle font-body text-xs leading-relaxed">
            Don't know the genre? Name artists or songs that capture the vibe — that's just as helpful.
          </p>
        </div>

        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-1.5" htmlFor="storyOrLyrics">
            Story, Memory, or Your Own Lyrics <span className="text-gold">*</span>
          </label>
          <textarea
            id="storyOrLyrics" rows={7}
            placeholder="Share the story or memory you want captured — who it's about, what happened, what you want to feel when you hear it. Or, if you have your own writing (a poem, diary entry, song draft, or anything else), paste it right here and we'll set it to music."
            {...register("storyOrLyrics", { required: "Please share the story, memory, or lyrics for this song" })}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
          />
          {errors.storyOrLyrics && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.storyOrLyrics.message}</p>
          )}
        </div>

        {/* Song Length */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Song Length <span className="text-gold">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {LENGTH_OPTIONS.map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => setValue("songLength", opt.value, { shouldValidate: true })}
                className={`flex-1 rounded-sm border px-4 py-3 text-left transition-colors duration-150 cursor-pointer ${
                  songLength === opt.value
                    ? "bg-gold/10 border-gold"
                    : "bg-surface border-white/10 hover:border-gold/40"
                }`}
              >
                <p className={`font-body font-semibold text-sm mb-1 ${songLength === opt.value ? "text-gold" : "text-text-base"}`}>{opt.label}</p>
                <p className="font-body text-xs text-text-subtle leading-relaxed">{opt.structure}</p>
              </button>
            ))}
          </div>
          {/* I'm Not Sure */}
          <button type="button"
            onClick={() => setValue("songLength", UNSURE, { shouldValidate: true })}
            className={unsurePill(songLength === UNSURE) + " mt-2"}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            I&apos;m Not Sure
          </button>
          {songLength === UNSURE && (
            <p className="mt-2 text-text-subtle font-body text-xs italic leading-relaxed">{UNSURE_NOTE}</p>
          )}
          <input type="hidden" {...register("songLength", { required: "Please select a song length" })} />
          {errors.songLength && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.songLength.message}</p>
          )}
        </div>
      </fieldset>

      <div className="border-t border-white/5" />

      {/* ── Vocals ── */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">Vocals</legend>

        {/* Vocal Type */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Vocal Type <span className="text-gold">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {VOCAL_TYPE_OPTIONS.map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => setValue("vocalType", opt.value, { shouldValidate: true })}
                className={pillBase(vocalType === opt.value) + " flex-1 justify-center"}
              >{opt.label}</button>
            ))}
            <button type="button"
              onClick={() => setValue("vocalType", UNSURE, { shouldValidate: true })}
              className={unsurePill(vocalType === UNSURE) + " flex-1 justify-center"}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              I&apos;m Not Sure
            </button>
          </div>
          {vocalType === UNSURE && (
            <p className="mt-2 text-text-subtle font-body text-xs italic leading-relaxed">{UNSURE_NOTE}</p>
          )}
          <input type="hidden" {...register("vocalType", { required: "Please select a vocal type" })} />
          {errors.vocalType && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.vocalType.message}</p>
          )}
        </div>

        {/* Vocal Style */}
        <div>
          <label className="block text-text-muted font-body text-sm font-medium mb-2">
            Vocal Style <span className="text-gold">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {VOCAL_STYLE_OPTIONS.map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => {
                  setValue("vocalStyle", opt.value, { shouldValidate: true });
                  if (opt.value !== "Mixture") setMixStyles([]);
                }}
                className={pillBase(vocalStyle === opt.value)}
              >{opt.label}</button>
            ))}
            <button type="button"
              onClick={() => {
                setValue("vocalStyle", UNSURE, { shouldValidate: true });
                setMixStyles([]);
              }}
              className={unsurePill(vocalStyle === UNSURE)}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              I&apos;m Not Sure
            </button>
          </div>

          {/* Mixture sub-selector */}
          {isMixture && (
            <div className="mt-3 rounded-sm border border-gold/20 bg-gold/5 px-4 py-4">
              <p className="text-gold font-body text-xs font-semibold uppercase tracking-wide mb-3">
                Select styles to blend
              </p>
              <div className="flex flex-wrap gap-2">
                {MIXABLE_STYLES.map((style) => {
                  const picked = mixStyles.includes(style);
                  return (
                    <button key={style} type="button" onClick={() => toggleMixStyle(style)}
                      className={`cursor-pointer select-none rounded-sm px-3 py-2 font-body text-sm border transition-colors duration-150 ${
                        picked
                          ? "bg-gold text-background border-gold"
                          : "bg-surface border-white/10 text-text-muted hover:border-gold/40 hover:text-text-base"
                      }`}
                    >{style}</button>
                  );
                })}
              </div>
              {mixStyles.length > 0 && (
                <p className="mt-2.5 text-text-subtle font-body text-xs">
                  Selected: <span className="text-gold">{mixStyles.join(", ")}</span>
                </p>
              )}
            </div>
          )}

          {vocalStyle === UNSURE && (
            <p className="mt-2 text-text-subtle font-body text-xs italic leading-relaxed">{UNSURE_NOTE}</p>
          )}
          <input type="hidden" {...register("vocalStyle", { required: "Please select a vocal style" })} />
          {errors.vocalStyle && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.vocalStyle.message}</p>
          )}
        </div>
      </fieldset>

      {/* Hidden fields */}
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
        {status === "submitting"
          ? "Sending…"
          : activeCheckoutUrl
            ? "Submit & Proceed to Checkout"
            : "Send My Request"}
      </button>

      {activeCheckoutUrl && (
        <p className="text-text-subtle font-body text-xs text-center leading-relaxed">
          You'll be redirected to complete your purchase after submitting.
        </p>
      )}

      {effectiveCheckoutUrl && hasUnsure && (
        <p className="text-text-subtle font-body text-xs text-center leading-relaxed">
          Since some details are still being worked out, we'll send you the checkout link directly after we nail down the perfect options together.
        </p>
      )}
    </form>
  );
}
