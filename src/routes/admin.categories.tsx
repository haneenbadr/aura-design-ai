import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, ChevronDown, ChevronLeft, FolderTree, Pencil, Trash2, Info } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesPage });

type Node = { id: string; name: string; count: number; children?: Node[] };
const initialTree: Node[] = [
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

function addNode(nodes: Node[], parentId: string | null, newNode: Node): Node[] {
  if (parentId === null) return [...nodes, newNode];
  return nodes.map((n) => {
    if (n.id === parentId) {
      return { ...n, children: [...(n.children ?? []), newNode] };
    }
    if (n.children) return { ...n, children: addNode(n.children, parentId, newNode) };
    return n;
  });
}

function removeNode(nodes: Node[], id: string): Node[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => (n.children ? { ...n, children: removeNode(n.children, id) } : n));
}

function CategoriesPage() {
  const [tree, setTree] = useState<Node[]>(initialTree);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [parent, setParent] = useState<string>("root");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("الرجاء إدخال اسم الفئة");
      return;
    }
    const newNode: Node = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      count: 0,
    };
    setTree((t) => addNode(t, parent === "root" ? null : parent, newNode));
    toast.success("تم إنشاء الفئة بنجاح");
    setName("");
    setParent("root");
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    setTree((t) => removeNode(t, id));
    toast.success("تم حذف الفئة");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="إدارة الفئات"
        description="الفئات تُدار حصراً من قبل المسؤول"
        actions={
          <Button size="sm" className="bg-gradient-wood" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            فئة جديدة
          </Button>
        }
      />

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="size-4 text-accent mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">قاعدة عمل:</span> البائعون لا يستطيعون إنشاء أو تعديل أو حذف الفئات. يمكنهم فقط اختيار فئة موجودة عند رفع المنتجات.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard label="إجمالي الفئات" value={String(countAll(tree))} />
        <StatCard label="فئات رئيسية" value={String(tree.length)} />
        <StatCard label="فئات فرعية" value={String(countAll(tree) - tree.length)} />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <FolderTree className="size-4" />
            <span>هرمية الفئات</span>
          </div>
          <div className="space-y-1">
            {tree.map((n) => (
              <TreeRow key={n.id} node={n} depth={0} onDelete={handleDelete} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إنشاء فئة جديدة</DialogTitle>
            <DialogDescription>أضف فئة رئيسية أو فرعية ضمن الهرمية</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">اسم الفئة</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: كراسي مكتبية"
              />
            </div>
            <div className="space-y-2">
              <Label>الفئة الأم</Label>
              <Select value={parent} onValueChange={setParent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">— فئة رئيسية —</SelectItem>
                  {flatten(tree).map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button className="bg-gradient-wood" onClick={handleCreate}>إنشاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function countAll(nodes: Node[]): number {
  return nodes.reduce((sum, n) => sum + 1 + (n.children ? countAll(n.children) : 0), 0);
}

function flatten(nodes: Node[], depth = 0): { id: string; label: string }[] {
  return nodes.flatMap((n) => [
    { id: n.id, label: `${"— ".repeat(depth)}${n.name}` },
    ...(n.children ? flatten(n.children, depth + 1) : []),
  ]);
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

function TreeRow({
  node,
  depth,
  onDelete,
}: {
  node: Node;
  depth: number;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const has = !!node.children?.length;
  return (
    <div>
      <div
        className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/60 transition"
        style={{ paddingInlineStart: 8 + depth * 20 }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="size-5 grid place-items-center text-muted-foreground"
          disabled={!has}
        >
          {has ? (
            open ? <ChevronDown className="size-4" /> : <ChevronLeft className="size-4" />
          ) : (
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
          )}
        </button>
        <FolderTree className="size-4 text-accent" />
        <span className="font-medium">{node.name}</span>
        <Badge variant="secondary" className="text-[10px]">{node.count}</Badge>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7"><Pencil className="size-3.5" /></Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-destructive"
            onClick={() => onDelete(node.id)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
      {has && open && (
        <div>
          {node.children!.map((c) => (
            <TreeRow key={c.id} node={c} depth={depth + 1} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
