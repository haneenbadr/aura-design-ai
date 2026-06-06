import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Timer, Sparkles } from "lucide-react";
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/ai")({ component: AIMonitoringPage });

const trend = Array.from({ length: 24 }).map((_, i) => ({
  h: `${i}:00`,
  req: Math.round(200 + Math.sin(i / 2) * 80 + Math.random() * 60),
  lat: Math.round(1200 + Math.cos(i / 3) * 200 + Math.random() * 150),
}));

const services = [
  { name: "Image-to-Design", status: "Online", uptime: "99.98%" },
  { name: "Chat AI", status: "Online", uptime: "99.94%" },
  { name: "3D Conversion", status: "Warning", uptime: "97.20%" },
  { name: "Style Recommender", status: "Online", uptime: "99.91%" },
  { name: "Vector Search", status: "Offline", uptime: "—" },
];

const dot: Record<string, string> = {
  Online: "bg-emerald-500", Warning: "bg-amber-500", Offline: "bg-destructive",
};

function AIMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="مراقبة الذكاء الاصطناعي" description="مركز التحكم في خدمات AI" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="إجمالي الطلبات" value="84,210" delta={12} icon={Activity} accent="blue" />
        <KpiCard label="طلبات اليوم" value="2,940" delta={6} icon={Zap} accent="gold" />
        <KpiCard label="متوسط الاستجابة" value="1.2s" delta={-8} icon={Timer} accent="wood" />
        <KpiCard label="نقاط نشاط AI" value="92" delta={4} icon={Sparkles} accent="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">اتجاه الطلبات (آخر 24 ساعة)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="r" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="h" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="req" stroke="var(--accent)" fill="url(#r)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">زمن الاستجابة (ms)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="h" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="lat" stroke="var(--gold)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">حالة خدمات AI</CardTitle></CardHeader>
        <CardContent className="divide-y">
          {services.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className={cn("size-2.5 rounded-full animate-pulse-glow", dot[s.status])} />
                <span className="font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground tabular-nums">Uptime {s.uptime}</span>
                <span className="text-xs font-semibold">{s.status}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
