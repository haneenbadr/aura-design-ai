import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Canvas2D } from "@/components/editor/Canvas2D";
import { Scene3D } from "@/components/editor/Scene3D";
import { CATEGORIES, FURNITURE, type FurnitureCategory, type PlacedItem } from "@/components/editor/furniture";
import { AIChat } from "@/components/design/AIChat";
import {
  ArrowRight, Save, Download, Undo2, Redo2, Box, Square,
  Search, Sparkles, Grid3x3, Sofa, Image,
} from "lucide-react";

const searchSchema = z.object({
  room: z.string().optional(),
  style: z.string().optional(),
});

export const Route = createFileRoute("/editor")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "المحرر — داري" }] }),
  component: Editor,
});

// Initial layout templates per room type — "loaded" generation output
const TEMPLATES: Record<string, Omit<PlacedItem, "uid">[]> = {
  living: [
    { itemId: "sofa-3", x: 380, y: 200, rotation: 0 },
    { itemId: "armchair", x: 200, y: 280, rotation: 30 },
    { itemId: "coffee", x: 380, y: 320, rotation: 0 },
    { itemId: "tv", x: 380, y: 90, rotation: 0 },
    { itemId: "lamp-floor", x: 560, y: 280, rotation: 0 },
    { itemId: "plant", x: 110, y: 130, rotation: 0 },
  ],
  bedroom: [
    { itemId: "bed-q", x: 380, y: 200, rotation: 0 },
    { itemId: "side", x: 230, y: 200, rotation: 0 },
    { itemId: "side", x: 530, y: 200, rotation: 0 },
    { itemId: "lamp-table", x: 230, y: 200, rotation: 0 },
    { itemId: "lamp-table", x: 530, y: 200, rotation: 0 },
    { itemId: "shelf", x: 380, y: 360, rotation: 0 },
  ],
  default: [
    { itemId: "sofa-3", x: 380, y: 220, rotation: 0 },
    { itemId: "coffee", x: 380, y: 330, rotation: 0 },
    { itemId: "plant", x: 130, y: 150, rotation: 0 },
  ],
};

function uid() { return Math.random().toString(36).slice(2, 9); }

function Editor() {
  const { room, style } = Route.useSearch();

  // History stack for undo/redo
  const [items, setItemsState] = useState<PlacedItem[]>(() => {
    const tpl = TEMPLATES[room ?? ""] ?? TEMPLATES.default;
    return tpl.map((t) => ({ ...t, uid: uid() }));
  });
  const historyRef = useRef<PlacedItem[][]>([items]);
  const indexRef = useRef(0);

  const setItems = (next: PlacedItem[]) => {
    setItemsState(next);
    // Truncate forward history then push
    historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
    historyRef.current.push(next);
    indexRef.current = historyRef.current.length - 1;
  };

  const undo = () => {
    if (indexRef.current === 0) return;
    indexRef.current -= 1;
    setItemsState(historyRef.current[indexRef.current]);
  };
  const redo = () => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current += 1;
    setItemsState(historyRef.current[indexRef.current]);
  };

  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [cat, setCat] = useState<FurnitureCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [showBg, setShowBg] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  // Load AI-generated design from previous step
  useEffect(() => {
    try {
      const url = sessionStorage.getItem("dari:lastDesign");
      if (url) setBgUrl(url);
    } catch {}
  }, []);

  const filtered = useMemo(
    () => FURNITURE.filter((f) =>
      (cat === "all" || f.category === cat) &&
      (query === "" || f.name.includes(query))
    ),
    [cat, query]
  );

  const onDropItem = (itemId: string, x: number, y: number) => {
    setItems([...items, { uid: uid(), itemId, x, y, rotation: 0 }]);
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
      if (e.key === "Delete" && selected) {
        setItems(items.filter((it) => it.uid !== selected));
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const doSave = () => { setSaved(true); setTimeout(() => setSaved(false), 1600); };

  const styleLabel: Record<string, string> = {
    modern: "حديث", classic: "كلاسيكي عربي", minimal: "بسيط",
    luxury: "فاخر", scandinavian: "اسكندنافي", industrial: "صناعي",
  };
  const roomLabel: Record<string, string> = {
    living: "غرفة معيشة", bedroom: "غرفة نوم", kitchen: "مطبخ", office: "مكتب", bath: "حمام",
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/design"><ArrowRight className="size-4" /></Link>
          </Button>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-gold" />
              مشروعي • {room ? roomLabel[room] ?? room : "غرفة جديدة"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {style ? `أسلوب: ${styleLabel[style] ?? style}` : "تصميم مولّد بالذكاء الاصطناعي"}
            </span>
          </div>

          <div className="mx-auto flex items-center gap-1 bg-secondary/60 rounded-xl p-1">
            <button
              onClick={() => setMode("2d")}
              className={`px-3 h-8 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${mode === "2d" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
            >
              <Square className="size-3.5" /> 2D
            </button>
            <button
              onClick={() => setMode("3d")}
              className={`px-3 h-8 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${mode === "3d" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
            >
              <Box className="size-3.5" /> 3D
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              className="size-9 rounded-lg hover:bg-secondary grid place-items-center"
              aria-label="تراجع"
              title="تراجع (Ctrl+Z)"
            >
              <Undo2 className="size-4" />
            </button>
            <button
              onClick={redo}
              className="size-9 rounded-lg hover:bg-secondary grid place-items-center"
              aria-label="إعادة"
              title="إعادة (Ctrl+Y)"
            >
              <Redo2 className="size-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            {bgUrl && (
              <button
                onClick={() => setShowBg((v) => !v)}
                className={`size-9 rounded-lg grid place-items-center ${showBg ? "bg-gold/20 text-gold-foreground" : "hover:bg-secondary"}`}
                aria-label="إظهار التصميم"
                title="إظهار/إخفاء صورة التصميم المولّد"
              >
                <Image className="size-4" />
              </button>
            )}
            <Button variant="ghost" size="sm">
              <Download className="size-4" /> تصدير
            </Button>
            <Button variant="hero" size="sm" onClick={doSave}>
              <Save className="size-4" /> {saved ? "تم الحفظ" : "حفظ"}
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 border-l border-border bg-card/60 flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <Sofa className="size-4 text-gold" /> مكتبة الأثاث
            </h3>
            <div className="relative">
              <Search className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث..."
                className="w-full h-9 rounded-lg border border-input bg-background pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
            <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`shrink-0 px-3 h-7 rounded-full text-xs font-medium transition-colors ${
                    cat === c.id
                      ? "bg-gradient-gold text-gold-foreground shadow-soft"
                      : "bg-secondary/60 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
            {filtered.map((f) => (
              <div
                key={f.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/furniture-id", f.id)}
                className="group cursor-grab active:cursor-grabbing rounded-xl border border-border bg-card p-3 hover:border-gold/50 hover:shadow-soft transition-all"
              >
                <div className={`h-16 rounded-lg ${f.color} grid place-items-center text-primary-foreground mb-2 group-hover:scale-105 transition-transform`}>
                  <f.icon className="size-5" />
                </div>
                <p className="text-xs font-semibold truncate">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{f.width}×{f.height}سم</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-2 text-xs text-center text-muted-foreground py-8">لا توجد نتائج</p>
            )}
          </div>

          <div className="p-3 border-t border-border text-[11px] text-muted-foreground space-y-1">
            <p className="flex items-center gap-2"><Grid3x3 className="size-3" /> اسحب وأفلت في اللوحة</p>
            <p>اضغط القطعة للتدوير أو الحذف</p>
          </div>
        </aside>

        {/* Canvas area */}
        <main className="flex-1 p-4 min-w-0 relative">
          {mode === "2d" ? (
            <div className="relative h-full w-full">
              {bgUrl && showBg && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
                  <img src={bgUrl} alt="تصميم AI" className="size-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-card/30" />
                </div>
              )}
              <div className="relative h-full w-full z-10">
                <Canvas2D
                  items={items}
                  setItems={setItems}
                  selected={selected}
                  setSelected={setSelected}
                  onDropItem={onDropItem}
                />
              </div>
            </div>
          ) : (
            <Scene3D items={items} selected={selected} setSelected={setSelected} />
          )}
        </main>
      </div>

      <AIChat
        context={{ room, style, hasImage: !!bgUrl }}
        applying={regenerating}
        onApplyEdit={async (extra) => {
          setRegenerating(true);
          // محاكاة التوليد — اربط backend الخاص بك هنا
          await new Promise((r) => setTimeout(r, 900));
          const url = `https://picsum.photos/seed/${encodeURIComponent(extra)}/1024/640`;
          setBgUrl(url);
          setShowBg(true);
          try { sessionStorage.setItem("dari:lastDesign", url); } catch {}
          setRegenerating(false);
        }}
      />
    </div>
  );
}
