import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  label: string;
  href: string;
  description?: string;
}

export default function NavigationCard({ label, href, description }: Props) {
  return (
    <Link
      href={href}
      className="group mt-2 flex items-center justify-between gap-3 border border-gold/25 bg-surface px-4 py-3.5 hover:border-gold/60 hover:bg-surface-elevated active:bg-surface-elevated transition-all duration-200 rounded-lg min-h-[52px]"
    >
      <div className="min-w-0">
        <p className="text-gold font-body text-[11px] tracking-[0.15em] uppercase font-medium">
          {label}
        </p>
        {description && (
          <p className="text-text-muted text-[10px] font-body mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      <ArrowRight className="w-4 h-4 text-gold/50 group-hover:text-gold group-hover:translate-x-0.5 flex-shrink-0 transition-all" />
    </Link>
  );
}
