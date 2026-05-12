import { Sofa, Bed, Armchair, Table, Lamp, Tv, BookOpen, Flower2, type LucideIcon } from "lucide-react";

export type FurnitureCategory = "seating" | "tables" | "lighting" | "decor" | "storage";

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  icon: LucideIcon;
  width: number;   // canvas units
  height: number;
  color: string;   // tailwind bg class via design tokens
}

export const CATEGORIES: { id: FurnitureCategory | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "seating", label: "جلوس" },
  { id: "tables", label: "طاولات" },
  { id: "lighting", label: "إضاءة" },
  { id: "decor", label: "ديكور" },
  { id: "storage", label: "تخزين" },
];

export const FURNITURE: FurnitureItem[] = [
  { id: "sofa-3", name: "كنبة ٣ مقاعد", category: "seating", icon: Sofa, width: 200, height: 90, color: "bg-primary/80" },
  { id: "armchair", name: "كرسي مريح", category: "seating", icon: Armchair, width: 95, height: 95, color: "bg-primary/70" },
  { id: "bed-q", name: "سرير مزدوج", category: "seating", icon: Bed, width: 220, height: 170, color: "bg-primary/85" },
  { id: "coffee", name: "طاولة قهوة", category: "tables", icon: Table, width: 130, height: 70, color: "bg-secondary" },
  { id: "side", name: "طاولة جانبية", category: "tables", icon: Table, width: 60, height: 60, color: "bg-secondary" },
  { id: "lamp-floor", name: "أباجورة أرضية", category: "lighting", icon: Lamp, width: 50, height: 50, color: "bg-gold/70" },
  { id: "lamp-table", name: "أباجورة طاولة", category: "lighting", icon: Lamp, width: 40, height: 40, color: "bg-gold/60" },
  { id: "tv", name: "شاشة تلفاز", category: "decor", icon: Tv, width: 160, height: 30, color: "bg-foreground/80" },
  { id: "shelf", name: "رف كتب", category: "storage", icon: BookOpen, width: 140, height: 40, color: "bg-primary/60" },
  { id: "plant", name: "نبتة", category: "decor", icon: Flower2, width: 50, height: 50, color: "bg-accent/50" },
];

export interface PlacedItem {
  uid: string;
  itemId: string;
  x: number;       // px from left of canvas
  y: number;
  rotation: number;
}
