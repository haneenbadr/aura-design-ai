import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Package, Sparkles } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

const data = [
  { m: "يناير", users: 320, vendors: 12, products: 90, designs: 410 },
  { m: "فبراير", users: 480, vendors: 18, products: 140, designs: 620 },
  { m: "مارس", users: 690, vendors: 26, products: 220, designs: 880 },
  { m: "أبريل", users: 910, vendors: 34, products: 310, designs: 1150 },
  { m: "مايو", users: 1180, vendors: 41, products: 420, designs: 1480 },
  { m: "يونيو", users: 1520, vendors: 53, products: 560, designs: 1920 },
];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="التحليلات" description="رؤى عميقة حول نمو المنصة" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="نمو المستخدمين" value="+14%" delta={14} icon={Users} accent="wood" />
        <KpiCard label="نمو البائعين" value="+8%" delta={8} icon={Store} accent="blue" />
        <KpiCard label="نمو المنتجات" value="+22%" delta={22} icon={Package} accent="gold" />
        <KpiCard label="نمو التصاميم" value="+31%" delta={31} icon={Sparkles} accent="wood" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "المستخدمون", key: "users", color: "var(--primary)" },
          { title: "البائعون", key: "vendors", color: "var(--accent)" },
          { title: "المنتجات", key: "products", color: "var(--gold)" },
          { title: "التصاميم", key: "designs", color: "var(--primary)" },
        ].map((c) => (
          <Card key={c.key}>
            <CardHeader><CardTitle className="text-base">{c.title}</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {c.key === "vendors" || c.key === "products" ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                    <Bar dataKey={c.key} fill={c.color} radius={[8, 8, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id={`g-${c.key}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={c.color} stopOpacity={0.6} />
                        <stop offset="100%" stopColor={c.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey={c.key} stroke={c.color} fill={`url(#g-${c.key})`} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">ملخص الرؤى</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { t: "أعلى نمو", v: "التصاميم المُولّدة (+31%)" },
            { t: "النمط الأكثر طلباً", v: "مودرن (38%)" },
            { t: "أكثر غرفة شعبية", v: "غرفة المعيشة" },
          ].map((x) => (
            <div key={x.t} className="p-4 rounded-xl bg-gradient-hero border">
              <p className="text-xs text-muted-foreground">{x.t}</p>
              <p className="font-bold mt-1">{x.v}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
