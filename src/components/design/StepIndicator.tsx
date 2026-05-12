import { Check } from "lucide-react";

export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center justify-between gap-2 sm:gap-4">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={[
                "size-9 sm:size-10 shrink-0 rounded-xl grid place-items-center font-bold text-sm transition-all",
                done && "bg-gradient-gold text-gold-foreground shadow-soft",
                active && "bg-gradient-wood text-primary-foreground shadow-glow scale-110",
                !done && !active && "bg-secondary text-muted-foreground",
              ].filter(Boolean).join(" ")}
            >
              {done ? <Check className="size-4" /> : (i + 1).toLocaleString("ar-EG")}
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className={`text-xs font-semibold truncate ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-border relative overflow-hidden">
                <div
                  className="absolute inset-y-0 right-0 bg-gradient-gold transition-all duration-500"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
