import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Share Your Vision",
    description:
      "Fill out the inquiry form with details about your project — who it's for, the occasion, the style, and any specific ideas or stories you want woven in.",
  },
  {
    number: "02",
    title: "We Write & Produce",
    description:
      "We craft original lyrics tailored to your story, then produce a professional recording using Suno AI's cutting-edge music generation platform.",
  },
  {
    number: "03",
    title: "Review & Refine",
    description:
      "You receive your song and can request revisions to make it perfect. We work with you until the final version feels exactly right.",
  },
  {
    number: "04",
    title: "Your Song Is Delivered",
    description:
      "You receive high-quality MP3 and WAV files ready to share, play, or use however you need. Your song may be added to the Brass Note Studios public portfolio with your permission.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionHeading
            eyebrow="How It Works"
            title="From Idea to Song"
            subtitle="A simple, collaborative process designed to make the experience as easy and meaningful as the music itself."
            centered
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[60%] right-0 h-px bg-gold/15 z-0" />
              )}

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full border-2 border-gold/30 bg-surface-elevated flex items-center justify-center mb-5">
                  <span className="font-display text-gold text-sm font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-lg text-text-base mb-3">
                  {step.title}
                </h3>
                <p className="text-text-muted font-body text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
