import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, SlidersHorizontal, Heart, Star, ShoppingCart,
  Sparkles, ShieldCheck, Truck, Store,
} from "lucide-react";
import insp1 from "@/assets/insp-1.jpg";
import insp2 from "@/assets/insp-2.jpg";
import insp3 from "@/assets/insp-3.jpg";
import insp4 from "@/assets/insp-4.jpg";
import insp5 from "@/assets/insp-5.jpg";
import insp6 from "@/assets/insp-6.jpg";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "السوق — داري" },
      { name: "description", content: "اكتشف قطع أثاث وديكور حقيقية من موردين موثوقين بنسبة تطابق ذكية مع تصاميمك." },
      { property: "og:title", content: "سوق الموردين — داري" },
      { property: "og:description", content: "تسوق منتجات تطابق تصاميمك بالذكاء الاصطناعي." },
    ],
  }),
  component: MarketplacePage,
});

type Product = {
  id: string;
  title: string;
  vendor: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: "أثاث" | "إضاءة" | "سجاد" | "ديكور" | "مطبخ";
  style: "اسكندنافي" | "تراثي" | "كلاسيكي" | "حديث" | "بوهيمي";
  match: number;
  img: string;
  badge?: string;
};

const PRODUCTS: Product[] = [
  { id: "p1", title: "كرسي خشبي مريح", vendor: "ورشة الخشب", price: 1290, oldPrice: 1590, rating: 4.8, reviews: 124, category: "أثاث", style: "اسكندنافي", match: 96, img: insp1, badge: "الأكثر مبيعاً" },
  { id: "p2", title: "مجلس عربي مطرز", vendor: "بيت التراث", price: 4500, rating: 4.9, reviews: 87, category: "أثاث", style: "تراثي", match: 92, img: insp2 },
  { id: "p3", title: "ثريا كريستال أنيقة", vendor: "نور للإضاءة", price: 2150, oldPrice: 2600, rating: 4.7, reviews: 210, category: "إضاءة", style: "كلاسيكي", match: 88, img: insp3, badge: "خصم" },
  { id: "p4", title: "مكتبة قراءة جدارية", vendor: "بلوط ديزاين", price: 3200, rating: 4.6, reviews: 56, category: "أثاث", style: "حديث", match: 94, img: insp4 },
  { id: "p5", title: "مكتب منزلي بسيط", vendor: "ميسان", price: 980, rating: 4.5, reviews: 142, category: "أثاث", style: "حديث", match: 90, img: insp5 },
  { id: "p6", title: "مرآة حجرية فاخرة", vendor: "ستون آرت", price: 1750, rating: 4.8, reviews: 64, category: "ديكور", style: "كلاسيكي", match: 86, img: insp6 },
  { id: "p7", title: "سجادة صوف يدوية", vendor: "نسيج", price: 2890, oldPrice: 3400, rating: 4.9, reviews: 198, category: "سجاد", style: "بوهيمي", match: 91, img: insp2, badge: "صناعة يدوية" },
  { id: "p8", title: "أباجورة خشبية دافئة", vendor: "نور للإضاءة", price: 420, rating: 4.4, reviews: 76, category: "إضاءة", style: "اسكندنافي", match: 89, img: insp4 },
];

const CATEGORIES = ["الكل", "أثاث", "إضاءة", "سجاد", "ديكور", "مطبخ"] as const;
const STYLES = ["كل الأنماط", "اسكندنافي", "تراثي", "كلاسيكي", "حديث", "بوهيمي"] as const;
const SORTS = [
  { v: "match", l: "الأنسب لتصاميمي" },
  { v: "low", l: "السعر: من الأقل" },
  { v: "high", l: "السعر: من الأعلى" },
  { v: "rating", l: "الأعلى تقييماً" },
] as const;

function MarketplacePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("الكل");
  const [style, setStyle] = useState<(typeof STYLES)[number]>("كل الأنماط");
  const [sort, setSort] = useState<(typeof SORTS)[number]["v"]>("match");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const list = useMemo(() => {
    let xs = PRODUCTS.filter((p) =>
      (cat === "الكل" || p.category === cat) &&
      (style === "كل الأنماط" || p.style === style) &&
      (q.trim() === "" || p.title.includes(q) || p.vendor.includes(q))
    );
    if (sort === "low") xs = [...xs].sort((a, b) => a.price - b.price);
    else if (sort === "high") xs = [...xs].sort((a, b) => b.price - a.price);
    else if (sort === "rating") xs = [...xs].sort((a, b) => b.rating - a.rating);
    else xs = [...xs].sort((a, b) => b.match - a.match);
    return xs;
  }, [q, cat, style, sort]);

  const toggle = (s: Set<string>, id: string) => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-28 pb-20">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 shadow-elegant">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent mb-3">
                <Sparkles className="size-4" /> سوق داري
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                منتجات حقيقية <span className="text-gradient-gold">تطابق تصاميمك</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                تصفّح آلاف القطع من موردين موثوقين، مع نسبة تطابق ذكية مع غرفك التي صمّمتها بالذكاء الاصطناعي.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/design">صمّم غرفتك أولاً</Link>
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <Link to="/vendor">انضم كمورد</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex absolute -left-10 -bottom-10 gap-4 opacity-30">
              <img src={insp1} alt="" className="size-44 rounded-2xl object-cover rotate-6" />
              <img src={insp3} alt="" className="size-44 rounded-2xl object-cover -rotate-3" />
            </div>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { i: ShieldCheck, t: "موردون موثوقون", d: "كل بائع مُتحقق منه" },
              { i: Truck, t: "شحن لكل المدن", d: "تتبّع لحظي للطلب" },
              { i: Sparkles, t: "تطابق ذكي", d: "AI يربطك بالأنسب" },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="glass rounded-2xl p-4 flex items-center gap-3">
                <div className="size-11 rounded-xl bg-gradient-gold grid place-items-center">
                  <Icon className="size-5 text-gold-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="mx-auto max-w-7xl px-4 mt-10">
          <div className="glass rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحث عن منتج أو مورد…"
                  className="pr-10 h-11"
                />
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    cat === c ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary/60 hover:bg-secondary text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    style === s ? "bg-accent text-accent-foreground border-transparent" : "border-border hover:bg-secondary/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{list.length} منتج</p>
            {cart.size > 0 && (
              <Badge variant="default" className="gap-1">
                <ShoppingCart className="size-3" /> {cart.size} في السلة
              </Badge>
            )}
          </div>

          {list.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <p className="text-muted-foreground">لا توجد نتائج مطابقة. جرّب تصفية مختلفة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {list.map((p) => (
                <Card key={p.id} className="overflow-hidden hover-lift group border-border/60">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.img} alt={p.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                      <Badge className="bg-gradient-gold text-gold-foreground border-0 shadow-soft">
                        مطابقة {p.match}%
                      </Badge>
                      {p.badge && <Badge variant="secondary" className="shadow-soft">{p.badge}</Badge>}
                    </div>
                    <button
                      onClick={() => setFavs((s) => toggle(s, p.id))}
                      className="absolute top-3 left-3 size-9 rounded-full glass grid place-items-center hover:bg-card"
                      aria-label="المفضلة"
                    >
                      <Heart className={`size-4 ${favs.has(p.id) ? "fill-destructive text-destructive" : ""}`} />
                    </button>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold leading-tight truncate">{p.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Store className="size-3" /> {p.vendor}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold shrink-0">
                        <Star className="size-3.5 fill-gold text-gold" />
                        {p.rating}
                        <span className="text-muted-foreground font-normal">({p.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-extrabold">{p.price.toLocaleString("ar-EG")}</span>
                          <span className="text-xs text-muted-foreground">ر.س</span>
                        </div>
                        {p.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {p.oldPrice.toLocaleString("ar-EG")}
                          </span>
                        )}
                      </div>
                      <Button
                        variant={cart.has(p.id) ? "secondary" : "gold"}
                        size="sm"
                        onClick={() => setCart((s) => toggle(s, p.id))}
                      >
                        <ShoppingCart className="size-4" />
                        {cart.has(p.id) ? "في السلة" : "إضافة"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
