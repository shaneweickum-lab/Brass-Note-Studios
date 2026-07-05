"use client";

import { STAGE_ORDER, STAGE_LABELS, STAGE_CLIENT_DESCRIPTIONS } from "@/types/commission";
import type { ProductionStage } from "@/types/commission";

interface StageTrackerProps {
  currentStage: ProductionStage;
}

export default function StageTracker({ currentStage }: StageTrackerProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="space-y-6">
      {/* Desktop: horizontal track */}
      <div className="hidden sm:flex items-center w-full">
        {STAGE_ORDER.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const isLast = index === STAGE_ORDER.length - 1;

          return (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              {/* Stage node */}
              <div className="flex flex-col items-center gap-2 relative">
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    border-2 transition-all duration-300
                    ${isCompleted
                      ? "border-teal bg-teal/10"
                      : isCurrent
                      ? "border-gold bg-gold/10"
                      : "border-white/10 bg-transparent"
                    }
                    ${isFuture ? "opacity-40" : ""}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    font-body text-xs tracking-wide whitespace-nowrap
                    ${isCompleted ? "text-teal" : isCurrent ? "text-gold font-semibold" : "text-text-subtle opacity-40"}
                  `}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 mt-[-1.25rem]">
                  <div
                    className={`h-px w-full ${
                      index < currentIndex ? "bg-teal/40" : "bg-white/8"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex sm:hidden flex-col space-y-3">
        {STAGE_ORDER.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const isLast = index === STAGE_ORDER.length - 1;

          return (
            <div key={stage} className="flex items-start gap-3">
              {/* Left column: circle + connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                    border-2 transition-all duration-300
                    ${isCompleted
                      ? "border-teal bg-teal/10"
                      : isCurrent
                      ? "border-gold bg-gold/10"
                      : "border-white/10 bg-transparent"
                    }
                    ${isFuture ? "opacity-40" : ""}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-px h-6 mt-1 ${index < currentIndex ? "bg-teal/40" : "bg-white/8"}`} />
                )}
              </div>

              {/* Right column: label */}
              <span
                className={`
                  font-body text-sm tracking-wide pt-1
                  ${isCompleted ? "text-teal" : isCurrent ? "text-gold font-semibold" : "text-text-subtle opacity-40"}
                `}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stage description */}
      <p className="font-body text-sm text-text-muted leading-relaxed border-l-2 border-gold/30 pl-4">
        {STAGE_CLIENT_DESCRIPTIONS[currentStage]}
      </p>
    </div>
  );
}
