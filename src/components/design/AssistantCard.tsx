import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AssistantCard({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="shrink-0 size-11 rounded-2xl bg-gradient-gold grid place-items-center shadow-soft">
          <Sparkles className="size-5 text-gold-foreground" />
        </div>
        <div className="flex-1 relative">
          <div className="absolute top-4 -right-1.5 size-3 rotate-45 bg-gradient-to-br from-gold/15 to-secondary/60 border-r border-t border-gold/25" />
          <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-gold/10 via-card to-secondary/40 border border-gold/25 px-5 py-4 shadow-soft">
            <p className="text-[11px] font-semibold text-gold mb-1.5 flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-gold animate-pulse-glow" />
              المصمم الذكي
            </p>
            <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line space-y-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
