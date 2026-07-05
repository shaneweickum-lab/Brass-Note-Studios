import type { ProductionStage } from "@/types/commission";

/**
 * Returns Tailwind class strings for a production stage pill.
 *
 * Note: the Tailwind config replaces the default `teal` and `amber` color
 * scales with single-value strings, so `text-teal-400` / `text-amber-400`
 * would not be generated. We use:
 *   writing  → text-teal  (custom #00B4B4)
 *   review   → text-yellow-400 (default palette, visually equivalent to amber-400)
 */
export function stageStyle(stage: ProductionStage): string {
  switch (stage) {
    case "intake":
      return "text-text-muted border-white/20";
    case "writing":
      return "text-teal border-teal/40 bg-teal/10";
    case "production":
      return "text-gold border-gold/40 bg-gold/10";
    case "review":
      return "text-yellow-400 border-yellow-400/40 bg-yellow-400/10";
    case "revision":
      return "text-orange-400 border-orange-400/40 bg-orange-400/10";
    case "delivered":
      return "text-emerald-400 border-emerald-400/40 bg-emerald-400/10";
  }
}
