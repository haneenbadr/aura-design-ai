import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label, value, delta, icon: Icon, accent = "wood",
}: {
  label: string; value: string | number; delta?: number;
  icon: LucideIcon; accent?: "wood" | "gold" | "blue";
}) {
  const positive = (delta ?? 0) >= 0;
  const accentBg = { wood: "bg-gradient-wood", gold: "bg-gradient-gold", blue: "bg-gradient-blue" }[accent];
  return (
    <Card className="hover-lift overflow-hidden relative">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1.5 tabular-nums">{value}</p>
          </div>
          <div className={cn("size-10 rounded-xl grid place-items-center text-primary-foreground shadow-soft", accentBg)}>
            <Icon className="size-5" />
          </div>
        </div>
        {delta !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-medium",
              positive ? "text-emerald-700 bg-emerald-500/10" : "text-destructive bg-destructive/10")}>
              {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {Math.abs(delta)}%
            </span>
            <span className="text-muted-foreground">مقارنة بالشهر الماضي</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
