import { useEffect, useRef, useState } from "react";
import { FURNITURE, type PlacedItem } from "./furniture";
import { RotateCw, Trash2 } from "lucide-react";

interface Props {
  items: PlacedItem[];
  setItems: (next: PlacedItem[]) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  onDropItem: (itemId: string, x: number, y: number) => void;
}

export function Canvas2D({ items, setItems, selected, setSelected, onDropItem }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ uid: string; offX: number; offY: number } | null>(null);
  const [hoverDrop, setHoverDrop] = useState(false);

  // Pointer move while dragging existing item
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left - dragging.offX;
      const y = e.clientY - rect.top - dragging.offY;
      setItems(items.map((it) => it.uid === dragging.uid ? { ...it, x, y } : it));
    };
    const onUp = () => setDragging(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, items, setItems]);

  const removeItem = (uid: string) => {
    setItems(items.filter((it) => it.uid !== uid));
    setSelected(null);
  };
  const rotateItem = (uid: string) => {
    setItems(items.map((it) => it.uid === uid ? { ...it, rotation: (it.rotation + 15) % 360 } : it));
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-secondary/30 rounded-2xl border border-border"
      onClick={() => setSelected(null)}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Room outline */}
      <div className="absolute inset-6 rounded-xl border-2 border-primary/30 bg-card/40 pointer-events-none" />

      {/* Drop area */}
      <div
        ref={ref}
        onDragOver={(e) => { e.preventDefault(); setHoverDrop(true); }}
        onDragLeave={() => setHoverDrop(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHoverDrop(false);
          const itemId = e.dataTransfer.getData("text/furniture-id");
          if (!itemId) return;
          const rect = ref.current!.getBoundingClientRect();
          onDropItem(itemId, e.clientX - rect.left, e.clientY - rect.top);
        }}
        className={`absolute inset-0 ${hoverDrop ? "bg-gold/10" : ""} transition-colors`}
      >
        {items.map((p) => {
          const def = FURNITURE.find((f) => f.id === p.itemId);
          if (!def) return null;
          const isSel = selected === p.uid;
          const Icon = def.icon;
          return (
            <div
              key={p.uid}
              onClick={(e) => { e.stopPropagation(); setSelected(p.uid); }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setSelected(p.uid);
                const rect = ref.current!.getBoundingClientRect();
                setDragging({
                  uid: p.uid,
                  offX: e.clientX - rect.left - p.x,
                  offY: e.clientY - rect.top - p.y,
                });
              }}
              className={[
                "absolute select-none touch-none cursor-grab active:cursor-grabbing rounded-lg shadow-soft transition-shadow",
                def.color,
                isSel ? "ring-2 ring-gold shadow-glow" : "ring-1 ring-foreground/10",
              ].join(" ")}
              style={{
                left: p.x,
                top: p.y,
                width: def.width,
                height: def.height,
                transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              }}
            >
              <div className="size-full grid place-items-center text-primary-foreground">
                <Icon className="size-5 opacity-90" />
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-foreground whitespace-nowrap pointer-events-none">
                {def.name}
              </span>

              {isSel && (
                <div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 glass rounded-xl p-1 shadow-elegant"
                  style={{ transform: `translate(-50%, 0) rotate(${-p.rotation}deg)` }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); rotateItem(p.uid); }}
                    className="size-8 rounded-lg hover:bg-secondary grid place-items-center"
                    aria-label="تدوير"
                  >
                    <RotateCw className="size-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(p.uid); }}
                    className="size-8 rounded-lg hover:bg-destructive/20 hover:text-destructive grid place-items-center"
                    aria-label="حذف"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <p className="font-semibold">اسحب الأثاث من الجانب لبدء التصميم</p>
              <p className="text-xs mt-1">أو اختر تصميماً مولّداً مسبقاً</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
