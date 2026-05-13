import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Search, SlidersHorizontal, Heart, Star, Sparkles,
  ShieldCheck, MapPin, Phone, MessageCircle, Store, Wand2, ArrowLeft, Globe,
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
      { title: "اقتراحات الموردين — داري" },
      { name: "description", content: "نطابق تصميمك بمنتجات قريبة الشبه عند موردين موثوقين، ونوصلك بهم مباشرة." },
      { property: "og:title", content: "اقتراحات الموردين — داري" },
      { property: "og:description", content: "AI يقترح لك الموردين الأقرب لتصميمك." },
    ],
  }),
  component: MarketplacePage,
});

type Match = {
  id: string;
  productTitle: string;     // اسم المنتج عند المورد
  vendor: string;
  city: string;
  address: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  rating: number;
  reviews: number;
  category: "أثاث" | "إضاءة" | "سجاد" | "ديكور" | "مطبخ";
  style: "اسكندنافي" | "تراثي" | "كلاسيكي" | "حديث" | "بوهيمي";
  match: number;            // نسبة تطابق AI مع تصميم اليوزر
  similarTo: string;        // اسم العنصر في تصميم اليوزر
  img: string;
  verified?: boolean;
};

const MATCHES: Match[] = [
  { id: "m1", productTitle: "سرير خشبي مزدوج بإطار طبيعي", vendor: "ورشة الخشب", city: "الرياض", address: "حي العليا، شارع التحلية", phone: "+966 55 123 4567", whatsapp: "+966 55 123 4567", website: "https://workshop-wood.sa", rating: 4.8, reviews: 124, category: "أثاث", style: "اسكندنافي", match: 96, similarTo: "السرير في غرفة النوم", img: insp1, verified: true },
  { id: "m2", productTitle: "مجلس عربي مطرز بألوان دافئة", vendor: "بيت التراث", city: "جدة", address: "حي الروضة، طريق الأمير سلطان", phone: "+966 56 222 3344", whatsapp: "+966 56 222 3344", rating: 4.9, reviews: 87, category: "أثاث", style: "تراثي", match: 92, similarTo: "مجلس الضيوف", img: insp2, verified: true },
  { id: "m3", productTitle: "ثريا كريستال متوسطة", vendor: "نور للإضاءة", city: "الدمام", address: "حي الفيصلية، شارع الملك فهد", phone: "+966 53 998 1122", website: "https://noor-light.sa", rating: 4.7, reviews: 210, category: "إضاءة", style: "كلاسيكي", match: 88, similarTo: "إضاءة الصالة", img: insp3 },
  { id: "m4", productTitle: "مكتبة جدارية بخشب البلوط", vendor: "بلوط ديزاين", city: "الرياض", address: "حي الملقا، طريق الملك سلمان", phone: "+966 50 765 4321", whatsapp: "+966 50 765 4321", rating: 4.6, reviews: 56, category: "أثاث", style: "حديث", match: 94, similarTo: "ركن القراءة", img: insp4, verified: true },
  { id: "m5", productTitle: "مكتب عمل بسيط بسطح خشبي", vendor: "ميسان", city: "الخبر", address: "حي العقربية، شارع الكورنيش", phone: "+966 54 321 0987", rating: 4.5, reviews: 142, category: "أثاث", style: "حديث", match: 90, similarTo: "المكتب المنزلي", img: insp5 },
  { id: "m6", productTitle: "مرآة جدارية بإطار حجري", vendor: "ستون آرت", city: "جدة", address: "حي السلامة، شارع فلسطين", phone: "+966 55 444 7788", website: "https://stone-art.sa", rating: 4.8, reviews: 64, category: "ديكور", style: "كلاسيكي", match: 86, similarTo: "ديكور المدخل", img: insp6 },
  { id: "m7", productTitle: "سجادة صوف يدوية بألوان ترابية", vendor: "نسيج", city: "الرياض", address: "حي الورود، شارع موسى بن نصير", phone: "+966 58 111 2233", whatsapp: "+966 58 111 2233", rating: 4.9, reviews: 198, category: "سجاد", style: "بوهيمي", match: 91, similarTo: "سجادة المعيشة", img: insp2, verified: true },
  { id: "m8", productTitle: "أباجورة خشبية دافئة", vendor: "نور للإضاءة", city: "الدمام", address: "حي الفيصلية، شارع الملك فهد", phone: "+966 53 998 1122", website: "https://noor-light.sa", rating: 4.4, reviews: 76, category: "إضاءة", style: "اسكندنافي", match: 89, similarTo: "إضاءة جانب السرير", img: insp4 },
];

const CATEGORIES = ["الكل", "أثاث", "إضاءة", "سجاد", "ديكور", "مطبخ"] as const;
const STYLES = ["كل الأنماط", "اسكندنافي", "تراثي", "كلاسيكي", "حديث", "بوهيمي"] as const;
const SORTS = [
  { v: "match", l: "الأعلى تطابقاً" },
  { v: "rating", l: "الأعلى تقييماً" },
  { v: "reviews", l: "الأكثر مراجعات" },
] as const;

function MarketplacePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("الكل");
  const [style, setStyle] = useState<(typeof STYLES)[number]>("كل الأنماط");
  const [sort, setSort] = useState<(typeof SORTS)[number]["v"]>("match");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Match | null>(null);

  const list = useMemo(() => {
    let xs = MATCHES.filter((p) =>
      (cat === "الكل" || p.category === cat) &&
      (style === "كل الأنماط" || p.style === style) &&
      (q.trim() === "" ||
        p.productTitle.includes(q) ||
        p.vendor.includes(q) ||
        p.similarTo.includes(q))
    );
    if (sort === "rating") xs = [...xs].sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") xs = [...xs].sort((a, b) => b.reviews - a.reviews);
    else xs = [...xs].sort((a, b) => b.match - a.match);
    return xs;
  }, [q, cat, style, sort]);

  const toggleFav = (id: string) => {
    setFavs((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
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
                <Wand2 className="size-4" /> مطابقة ذكية
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                موردون عندهم <span className="text-gradient-gold">قطع شبيهة بتصميمك</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                وكيل الذكاء الاصطناعي يحلّل عناصر تصميمك ويقترح لك أقرب المنتجات الموجودة فعلاً عند موردين موثوقين، ويوصلك بهم مباشرة. البيع والاتفاق يتمّان بينك وبين المورد خارج المنصة.
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

          {/* How it works strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { i: Wand2, t: "١. صمّم غرفتك", d: "AI يفهم العناصر والنمط" },
              { i: Sparkles, t: "٢. نطابق مع الموردين", d: "نقترح أقرب القطع شبهاً" },
              { i: MessageCircle, t: "٣. تواصل مباشر", d: "الاتفاق والبيع خارج المنصة" },
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
                  placeholder="ابحث باسم العنصر أو المورد…"
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

        {/* Matches grid */}
        <section className="mx-auto max-w-7xl px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{list.length} اقتراح مطابق</p>
            <p className="text-xs text-muted-foreground">الترتيب حسب جودة المطابقة مع تصميمك</p>
          </div>

          {list.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <p className="text-muted-foreground">لا توجد اقتراحات مطابقة. جرّب تصفية مختلفة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((p) => (
                <Card
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="overflow-hidden hover-lift group border-border/60 flex flex-col cursor-pointer text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  dir="rtl"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(p); } }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.img} alt={p.productTitle} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                      <Badge className="bg-gradient-gold text-gold-foreground border-0 shadow-soft">
                        مطابقة {p.match}%
                      </Badge>
                      {p.verified && (
                        <Badge variant="secondary" className="shadow-soft gap-1">
                          <ShieldCheck className="size-3" /> موثّق
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                      className="absolute top-3 left-3 size-9 rounded-full glass grid place-items-center hover:bg-card"
                      aria-label="المفضلة"
                    >
                      <Heart className={`size-4 ${favs.has(p.id) ? "fill-destructive text-destructive" : ""}`} />
                    </button>
                  </div>
                  <CardContent className="p-4 space-y-3 flex-1 flex flex-col items-end text-right">
                    <div className="w-full text-right">
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-2">
                        <Sparkles className="size-3" /> شبيه بـ: {p.similarTo}
                      </div>
                      <h3 className="font-bold leading-tight text-right">{p.productTitle}</h3>
                    </div>

                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-right">
                        <Store className="size-3.5" /> {p.vendor}
                      </span>
                      <span className="inline-flex items-center gap-1 text-right">
                        <MapPin className="size-3.5" /> {p.city}
                      </span>
                    </div>

                    <div className="flex w-full items-center justify-end gap-1 text-xs font-semibold text-right">
                      <Star className="size-3.5 fill-gold text-gold" />
                      {p.rating}
                      <span className="text-muted-foreground font-normal">({p.reviews} مراجعة)</span>
                    </div>

                    <p className="mt-auto w-full pt-2 text-[11px] text-muted-foreground text-right">اضغط لعرض بيانات المورد</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Footer note */}
        <section className="mx-auto max-w-7xl px-4 mt-10">
          <div className="glass rounded-2xl p-5 flex items-start gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="size-5 text-accent shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">داري</strong> منصّة مطابقة فقط: نوصلك بالموردين الأقرب لتصميمك. كل عمليات الشراء، السعر، والتوصيل تتمّ مباشرة بينك وبين المورد.
              {" "}
              <Link to="/design" className="inline-flex items-center gap-1 text-accent font-medium">
                ابدأ تصميماً جديداً <ArrowLeft className="size-3" />
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg text-right" dir="rtl">
          {selected && (
            <>
              <div className="relative aspect-[16/9] -mx-6 -mt-6 mb-4 overflow-hidden">
                <img src={selected.img} alt={selected.productTitle} className="size-full object-cover" />
                {selected.verified && (
                  <Badge variant="secondary" className="absolute top-3 right-3 shadow-soft gap-1">
                    <ShieldCheck className="size-3" /> مورد موثّق
                  </Badge>
                )}
              </div>
              <DialogHeader className="text-right">
                <DialogTitle className="text-right text-xl font-extrabold">{selected.vendor}</DialogTitle>
                <DialogDescription className="text-right">
                  المنتج المطابق: <span className="text-foreground font-medium">{selected.productTitle}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">المدينة</p>
                    <p className="font-medium">{selected.city}</p>
                  </div>
                  <MapPin className="size-4 text-accent shrink-0 mt-1" />
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">العنوان</p>
                    <p className="font-medium">{selected.address}</p>
                  </div>
                  <MapPin className="size-4 text-accent shrink-0 mt-1" />
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                    <p className="font-medium" dir="ltr">{selected.phone}</p>
                  </div>
                  <Phone className="size-4 text-accent shrink-0 mt-1" />
                </div>
                {selected.whatsapp && (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">واتساب</p>
                      <p className="font-medium" dir="ltr">{selected.whatsapp}</p>
                    </div>
                    <MessageCircle className="size-4 text-accent shrink-0 mt-1" />
                  </div>
                )}
                {selected.website && (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">الموقع الإلكتروني</p>
                      <a href={selected.website} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline" dir="ltr">{selected.website}</a>
                    </div>
                    <Globe className="size-4 text-accent shrink-0 mt-1" />
                  </div>
                )}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <span className="text-muted-foreground">({selected.reviews} مراجعة)</span>
                  <span className="font-semibold">{selected.rating}</span>
                  <Star className="size-4 fill-gold text-gold" />
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground bg-secondary/40 rounded-lg p-3 text-right">
                التواصل والاتفاق يتمّان مباشرة بينك وبين المورد خارج المنصة.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
