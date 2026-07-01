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
        <div className={cn("flex items-center gap-3 mb-6", centered && "justify-center")}>
          <span className="h-px w-8 bg-gold/35 shrink-0" />
          <p className="font-display-sc text-gold text-[10px] uppercase tracking-[0.3em] font-medium whitespace-nowrap">
            {eyebrow}
          </p>
          <span className="h-px w-8 bg-gold/35 shrink-0" />
        </div>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-base leading-tight font-light">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-text-muted font-body text-base leading-relaxed max-w-2xl", centered && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
