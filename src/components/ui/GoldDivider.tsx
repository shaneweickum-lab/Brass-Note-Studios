import { cn } from "@/lib/utils";

export default function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="h-px flex-1 bg-gold/20" />
      <div className="w-2 h-2 rotate-45 bg-gold/40" />
      <div className="h-px flex-1 bg-gold/20" />
    </div>
  );
}
