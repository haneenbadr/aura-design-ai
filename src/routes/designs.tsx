import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  Plus, Sparkles, Loader2, Pencil, Trash2, Calendar, Sofa, Palette,
  ImageIcon, Search, ArrowLeft,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/designs")({
  head: () => ({
    meta: [
      { title: "تصاميمي — داري" },
      { name: "description", content: "جميع مشاريعك المحفوظة في مكان واحد، جاهزة للتعديل والمشاركة." },
      { property: "og:title", content: "تصاميمي — داري" },
      { property: "og:description", content: "أدر مشاريع تصميمك الداخلي بسهولة." },
    ],
  }),
  component: DesignsPage,
});

type Design = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  room_type: string;
  style: string;
  status: string;
  thumbnail_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const ROOM_TYPES = [
  { v: "living_room", l: "صالة معيشة" },
  { v: "bedroom", l: "غرفة نوم" },
  { v: "kitchen", l: "مطبخ" },
  { v: "bathroom", l: "حمام" },
  { v: "office", l: "مكتب" },
  { v: "dining_room", l: "غرفة طعام" },
  { v: "majlis", l: "مجلس" },
  { v: "kids_room", l: "غرفة أطفال" },
] as const;

const STYLES = [
  { v: "modern", l: "حديث" },
  { v: "scandinavian", l: "اسكندنافي" },
  { v: "classic", l: "كلاسيكي" },
  { v: "traditional", l: "تراثي" },
  { v: "bohemian", l: "بوهيمي" },
  { v: "minimal", l: "بسيط" },
] as const;

const STATUSES = [
  { v: "draft", l: "مسودة", cls: "bg-secondary text-secondary-foreground" },
  { v: "in_progress", l: "قيد التنفيذ", cls: "bg-accent/15 text-accent" },
  { v: "completed", l: "مكتمل", cls: "bg-primary/15 text-primary" },
] as const;

const labelOf = <T extends { v: string; l: string }>(arr: readonly T[], v: string) =>
  arr.find((x) => x.v === v)?.l ?? v;

const designSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جداً").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  room_type: z.string().min(1),
  style: z.string().min(1),
  status: z.string().min(1),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function DesignsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Design | null>(null);
  const [editing, setEditing] = useState<Design | null>(null);
  const [deleting, setDeleting] = useState<Design | null>(null);

  // Auth gate
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.session?.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const designsQuery = useQuery({
    queryKey: ["designs", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Design[]> => {
      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Design[];
    },
  });

  const createMut = useMutation({
    mutationFn: async (input: z.infer<typeof designSchema>) => {
      if (!userId) throw new Error("غير مسجّل الدخول");
      const { data, error } = await supabase
        .from("designs")
        .insert({
          user_id: userId,
          name: input.name,
          description: input.description || null,
          room_type: input.room_type,
          style: input.style,
          status: input.status,
          notes: input.notes || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Design;
    },
    onSuccess: () => {
      toast.success("تم إنشاء التصميم");
      qc.invalidateQueries({ queryKey: ["designs", userId] });
      setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async (input: { id: string; values: z.infer<typeof designSchema> }) => {
      const { error } = await supabase
        .from("designs")
        .update({
          name: input.values.name,
          description: input.values.description || null,
          room_type: input.values.room_type,
          style: input.values.style,
          status: input.values.status,
          notes: input.values.notes || null,
        })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حفظ التعديلات");
      qc.invalidateQueries({ queryKey: ["designs", userId] });
      setEditing(null);
      setSelected(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("designs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حذف التصميم");
      qc.invalidateQueries({ queryKey: ["designs", userId] });
      setDeleting(null);
      setSelected(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = (designsQuery.data ?? []).filter((d) => {
    if (!search.trim()) return true;
    const q = search.trim();
    return d.name.includes(q) || (d.description ?? "").includes(q);
  });

  // Loading session
  if (userId === undefined) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 grid place-items-center pt-32 pb-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Not authenticated
  if (userId === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 grid place-items-center px-4 pt-32 pb-16">
          <div className="max-w-md text-center glass rounded-3xl p-10 shadow-elegant">
            <div className="size-16 mx-auto rounded-2xl bg-gradient-gold grid place-items-center shadow-glow mb-6">
              <Sparkles className="size-7 text-gold-foreground" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3">سجّل دخولك لعرض تصاميمك</h1>
            <p className="text-muted-foreground mb-8">
              تحتاج إلى حساب لحفظ مشاريعك وإدارتها في أي وقت.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Toaster richColors position="top-center" />
      <SiteHeader />
      <main className="flex-1 pt-28 pb-20">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 shadow-elegant">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl text-right">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent mb-3">
                  <Sparkles className="size-4" /> مساحتك الشخصية
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
                  تصاميمي <span className="text-gradient-gold">المحفوظة</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  جميع مشاريعك في مكان واحد. أنشئ تصميماً جديداً، عدّل القديم، أو افتح التفاصيل لاستكمال العمل.
                </p>
              </div>
              <Button variant="hero" size="lg" asChild className="shrink-0">
                <Link to="/design">
                  <Plus className="size-5" /> تصميم جديد
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mx-auto max-w-7xl px-4 mt-8">
          <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث في تصاميمك…"
                className="pr-10 h-11 text-right"
              />
            </div>
            <p className="text-sm text-muted-foreground text-right md:text-left">
              {designsQuery.isLoading ? "..." : `${list.length} تصميم`}
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-4 mt-6">
          {designsQuery.isLoading ? (
            <div className="grid place-items-center py-20">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState hasFilter={search.length > 0} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((d) => (
                <DesignCard key={d.id} design={d} onClick={() => setSelected(d)} />
              ))}
            </div>
          )}
        </section>

        {/* CTA back link */}
        <section className="mx-auto max-w-7xl px-4 mt-10">
          <div className="glass rounded-2xl p-5 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">جاهز تبدأ تصميم جديد بمساعدة الذكاء الاصطناعي؟</span>
            <Link to="/design" className="inline-flex items-center gap-1 text-accent font-medium">
              ابدأ مع المساعد <ArrowLeft className="size-3" />
            </Link>
          </div>
        </section>
      </main>

      {/* Create dialog */}
      <DesignFormDialog
        open={creating}
        onOpenChange={(o) => !o && setCreating(false)}
        title="تصميم جديد"
        submitLabel="إنشاء"
        loading={createMut.isPending}
        onSubmit={(values) => createMut.mutate(values)}
      />

      {/* Edit dialog */}
      <DesignFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title="تعديل التصميم"
        submitLabel="حفظ"
        loading={updateMut.isPending}
        initial={editing ?? undefined}
        onSubmit={(values) => editing && updateMut.mutate({ id: editing.id, values })}
      />

      {/* Details dialog */}
      <Dialog open={!!selected && !editing && !deleting} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg text-right" dir="rtl">
          {selected && (
            <>
              <DialogHeader className="text-right">
                <DialogTitle className="text-right text-xl font-extrabold">{selected.name}</DialogTitle>
                <DialogDescription className="text-right">
                  أُنشئ في {new Date(selected.created_at).toLocaleDateString("ar-EG")}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4 text-sm">
                {selected.description && (
                  <p className="text-foreground/90 leading-relaxed">{selected.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={<Sofa className="size-4" />} label="نوع الغرفة" value={labelOf(ROOM_TYPES, selected.room_type)} />
                  <InfoRow icon={<Palette className="size-4" />} label="النمط" value={labelOf(STYLES, selected.style)} />
                  <InfoRow icon={<Sparkles className="size-4" />} label="الحالة" value={labelOf(STATUSES, selected.status)} />
                  <InfoRow icon={<Calendar className="size-4" />} label="آخر تحديث" value={new Date(selected.updated_at).toLocaleDateString("ar-EG")} />
                </div>

                {selected.notes && (
                  <div className="rounded-lg bg-secondary/40 p-3">
                    <p className="text-xs text-muted-foreground mb-1">ملاحظات</p>
                    <p className="whitespace-pre-wrap">{selected.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6 gap-2 sm:justify-start">
                <Button variant="destructive" onClick={() => setDeleting(selected)}>
                  <Trash2 className="size-4" /> حذف
                </Button>
                <Button variant="outline" onClick={() => setEditing(selected)}>
                  <Pencil className="size-4" /> تعديل
                </Button>
                <Button variant="hero" onClick={() => navigate({ to: "/design" })}>
                  متابعة في المصمم
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">حذف التصميم؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              لا يمكن التراجع عن هذه العملية. سيُحذف "{deleting?.name}" نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && deleteMut.mutate(deleting.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMut.isPending ? <Loader2 className="size-4 animate-spin" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SiteFooter />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-secondary/30 p-3">
      <div className="text-accent mt-0.5">{icon}</div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function DesignCard({ design, onClick }: { design: Design; onClick: () => void }) {
  const status = STATUSES.find((s) => s.v === design.status);
  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="overflow-hidden hover-lift cursor-pointer text-right border-border/60 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      dir="rtl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary/60 to-muted/40">
        {design.thumbnail_url ? (
          <img src={design.thumbnail_url} alt={design.name} className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="size-full grid place-items-center text-muted-foreground">
            <ImageIcon className="size-10" />
          </div>
        )}
        {status && (
          <Badge className={`absolute top-3 right-3 border-0 shadow-soft ${status.cls}`}>{status.l}</Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-2 flex-1 flex flex-col items-end text-right">
        <h3 className="font-bold leading-tight w-full text-right">{design.name}</h3>
        {design.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 w-full text-right">{design.description}</p>
        )}
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1">
            <Sofa className="size-3.5" /> {labelOf(ROOM_TYPES, design.room_type)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Palette className="size-3.5" /> {labelOf(STYLES, design.style)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreate, hasFilter }: { onCreate: () => void; hasFilter: boolean }) {
  return (
    <div className="glass rounded-3xl p-12 text-center">
      <div className="size-16 mx-auto rounded-2xl bg-gradient-gold grid place-items-center shadow-glow mb-5">
        <Sparkles className="size-7 text-gold-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">
        {hasFilter ? "لا نتائج لبحثك" : "ابدأ أول تصميم لك"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {hasFilter ? "جرّب كلمة بحث مختلفة." : "احفظ مشاريع تصميمك هنا واستأنفها وقتما تشاء."}
      </p>
      {!hasFilter && (
        <Button variant="hero" onClick={onCreate}>
          <Plus className="size-4" /> تصميم جديد
        </Button>
      )}
    </div>
  );
}

function DesignFormDialog({
  open, onOpenChange, title, submitLabel, loading, initial, onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  submitLabel: string;
  loading: boolean;
  initial?: Design;
  onSubmit: (values: z.infer<typeof designSchema>) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [roomType, setRoomType] = useState(initial?.room_type ?? "living_room");
  const [style, setStyle] = useState(initial?.style ?? "modern");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  // Reset whenever a different initial design is loaded or dialog opens
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setRoomType(initial?.room_type ?? "living_room");
      setStyle(initial?.style ?? "modern");
      setStatus(initial?.status ?? "draft");
      setNotes(initial?.notes ?? "");
    }
  }, [open, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = designSchema.safeParse({
      name, description, room_type: roomType, style, status, notes,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    onSubmit(parsed.data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg text-right" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">{title}</DialogTitle>
          <DialogDescription className="text-right">
            احفظ تفاصيل مشروعك للوصول إليه لاحقاً.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="d-name">الاسم</Label>
            <Input id="d-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required className="text-right" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="d-desc">الوصف (اختياري)</Label>
            <Textarea id="d-desc" value={description ?? ""} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={2} className="text-right" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>نوع الغرفة</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="text-right"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((r) => <SelectItem key={r.v} value={r.v}>{r.l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>النمط</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="text-right"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>الحالة</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="text-right"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="d-notes">ملاحظات (اختياري)</Label>
            <Textarea id="d-notes" value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} maxLength={1000} rows={3} className="text-right" />
          </div>

          <DialogFooter className="gap-2 sm:justify-start">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" variant="hero" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
