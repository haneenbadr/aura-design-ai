import { createFileRoute } from "@tanstack/react-router";
import { Users, Store, FolderTree, Package, Sparkles, Activity, UserPlus, CheckCircle2, ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/")({ component: DashboardPage });

const growth = [
  { m: "يناير", users: 320, vendors: 12, products: 90, designs: 410 },
  { m: "فبراير", users: 480, vendors: 18, products: 140, designs: 620 },
  { m: "مارس", users: 690, vendors: 26, products: 220, designs: 880 },
  { m: "أبريل", users: 910, vendors: 34, products: 310, designs: 1150 },
  { m: "مايو", users: 1180, vendors: 41, products: 420, designs: 1480 },
  { m: "يونيو", users: 1520, vendors: 53, products: 560, designs: 1920 },
];
const roomTypes = [
  { name: "غرفة معيشة", v: 420 }, { name: "غرفة نوم", v: 380 },
  { name: "مطبخ", v: 220 }, { name: "غرفة طعام", v: 180 }, { name: "مكتب", v: 140 },
];
const styles = [
  { name: "مودرن", v: 38 }, { name: "كلاسيك", v: 22 },
  { name: "اسكندنافي", v: 18 }, { name: "بوهيمي", v: 12 }, { name: "صناعي", v: 10 },
];
const COLORS = ["var(--primary)", "var(--accent)", "var(--gold)", "var(--secondary)", "var(--muted-foreground)"];

const activity = [
  { icon: UserPlus, text: "مستخدم جديد: سارة الأحمدي", time: "منذ 5 د", tone: "default" as const },
  { icon: Store, text: "بائع جديد: أثاث الديوان", time: "منذ 18 د", tone: "secondary" as const },
  { icon: Package, text: "منتج جديد: أريكة كلاسيكية", time: "منذ 32 د", tone: "default" as const },
  { icon: CheckCircle2, text: "تمت الموافقة على: طاولة طعام خشبية", time: "منذ ساعة", tone: "secondary" as const },
  { icon: ImageIcon, text: "تم توليد تصميم: غرفة نوم اسكندنافية", time: "منذ ساعتين", tone: "default" as const },
];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="لوحة التحكم" description="نظرة شاملة على أداء المنصة في الوقت الحقيقي" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="إجمالي المستخدمين" value="12,480" delta={14} icon={Users} accent="wood" />
        <KpiCard label="إجمالي البائعين" value="328" delta={8} icon={Store} accent="blue" />
        <KpiCard label="إجمالي الفئات" value="42" delta={2} icon={FolderTree} accent="gold" />
        <KpiCard label="إجمالي المنتجات" value="5,612" delta={22} icon={Package} accent="wood" />
        <KpiCard label="التصاميم المُولّدة" value="18,940" delta={31} icon={Sparkles} accent="gold" />
        <KpiCard label="طلبات الذكاء" value="84,210" delta={-4} icon={Activity} accent="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">نمو المستخدمين والتصاميم</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth}>
                <defs>
                  <linearGradient id="u" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="d" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="users" stroke="var(--primary)" fill="url(#u)" name="مستخدمون" />
                <Area type="monotone" dataKey="designs" stroke="var(--gold)" fill="url(#d)" name="تصاميم" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">أنماط التصميم</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={styles} dataKey="v" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {styles.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">نمو البائعين والمنتجات</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="vendors" stroke="var(--accent)" strokeWidth={2} name="بائعون" />
                <Line type="monotone" dataKey="products" stroke="var(--primary)" strokeWidth={2} name="منتجات" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">أكثر أنواع الغرف</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="v" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">آخر النشاطات</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/60 transition">
                <div className="size-9 rounded-lg bg-secondary grid place-items-center shrink-0">
                  <a.icon className="size-4 text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight">{a.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{a.time}</p>
                </div>
                <Badge variant={a.tone} className="text-[10px]">جديد</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
