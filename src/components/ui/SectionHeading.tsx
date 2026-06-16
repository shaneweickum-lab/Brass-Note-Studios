import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <p className="text-gold font-body text-sm uppercase tracking-[0.2em] font-semibold mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-base leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-text-muted font-body text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
