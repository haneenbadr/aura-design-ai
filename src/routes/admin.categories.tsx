import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronLeft, FolderTree, Pencil, Trash2, Info } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesPage });

type Node = { id: string; name: string; count: number; children?: Node[] };
const tree: Node[] = [
  { id: "bed", name: "غرفة النوم", count: 312, children: [
    { id: "beds", name: "أسرّة", count: 142 },
    { id: "wd", name: "خزائن ملابس", count: 88 },
    { id: "ns", name: "كومودينو", count: 82 },
  ]},
  { id: "lv", name: "غرفة المعيشة", count: 540, children: [
    { id: "sofa", name: "أرائك", count: 220 },
    { id: "ct", name: "طاولات قهوة", count: 160 },
    { id: "tv", name: "وحدات تلفاز", count: 160 },
  ]},
  { id: "din", name: "غرفة الطعام", count: 198, children: [
    { id: "dt", name: "طاولات طعام", count: 92 },
    { id: "dc", name: "كراسي طعام", count: 106 },
  ]},
  { id: "kit", name: "المطبخ", count: 140 },
  { id: "off", name: "المكتب", count: 96 },
];

function CategoriesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="إدارة الفئات" description="الفئات تُدار حصراً من قبل المسؤول"
        actions={<Button size="sm" className="bg-gradient-wood"><Plus className="size-4" />فئة جديدة</Button>} />

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="size-4 text-accent mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">قاعدة عمل:</span> البائعون لا يستطيعون إنشاء أو تعديل أو حذف الفئات. يمكنهم فقط اختيار فئة موجودة عند رفع المنتجات.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard label="إجمالي الفئات" value="42" />
        <StatCard label="فئات رئيسية" value="5" />
        <StatCard label="فئات فرعية" value="37" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <FolderTree className="size-4" />
            <span>هرمية الفئات</span>
          </div>
          <div className="space-y-1">
            {tree.map((n) => <TreeRow key={n.id} node={n} depth={0} />)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="hover-lift">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1 tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

function TreeRow({ node, depth }: { node: Node; depth: number }) {
  const [open, setOpen] = useState(true);
  const has = !!node.children?.length;
  return (
    <div>
      <div
        className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/60 transition"
        style={{ paddingInlineStart: 8 + depth * 20 }}
      >
        <button onClick={() => setOpen(!open)} className="size-5 grid place-items-center text-muted-foreground" disabled={!has}>
          {has ? (open ? <ChevronDown className="size-4" /> : <ChevronLeft className="size-4" />) : <span className="size-1.5 rounded-full bg-muted-foreground/40" />}
        </button>
        <FolderTree className="size-4 text-accent" />
        <span className="font-medium">{node.name}</span>
        <Badge variant="secondary" className="text-[10px]">{node.count}</Badge>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7"><Pencil className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" className="size-7 text-destructive"><Trash2 className="size-3.5" /></Button>
        </div>
      </div>
      {has && open && <div>{node.children!.map((c) => <TreeRow key={c.id} node={c} depth={depth + 1} />)}</div>}
    </div>
  );
}
