import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Store, Package, MessageCircle, BarChart3, Plus, Sparkles, ShieldCheck,
  TrendingUp, Eye, Heart, Star, MapPin, Phone, Trash2, Pencil, Upload,
  CheckCircle2, Clock, Wand2, ArrowLeft,
} from "lucide-react";
import insp1 from "@/assets/insp-1.jpg";
import insp2 from "@/assets/insp-2.jpg";
import insp3 from "@/assets/insp-3.jpg";
import insp4 from "@/assets/insp-4.jpg";
import insp5 from "@/assets/insp-5.jpg";
import insp6 from "@/assets/insp-6.jpg";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "بوابة الموردين — داري" },
      { name: "description", content: "أدر منتجاتك، استقبل طلبات العملاء، وتابع تحليلات الأداء كمورد على داري." },
      { property: "og:title", content: "بوابة الموردين — داري" },
      { property: "og:description", content: "AI يربطك بعملاء يبحثون عن قطع شبيهة بمنتجاتك." },
    ],
  }),
  component: VendorPage,
});

type Category = "أثاث" | "إضاءة" | "سجاد" | "ديكور" | "مطبخ";
type Style = "اسكندنافي" | "تراثي" | "كلاسيكي" | "حديث" | "بوهيمي";
type Status = "منشور" | "مسودة";

type Product = {
  id: string;
  title: string;
  category: Category;
  style: Style;
  price: number;
  city: string;
  img: string;
  status: Status;
  views: number;
  favs: number;
  matches: number;
};

type Inquiry = {
  id: string;
  customer: string;
  product: string;
  message: string;
  city: string;
  ago: string;
  status: "جديد" | "قيد الرد" | "تم";
  match: number;
};

const SEED_PRODUCTS: Product[] = [
  { id: "p1", title: "سرير خشبي مزدوج بإطار طبيعي", category: "أثاث", style: "اسكندنافي", price: 2400, city: "الرياض", img: insp1, status: "منشور", views: 1240, favs: 86, matches: 23 },
  { id: "p2", title: "مجلس عربي مطرز بألوان دافئة", category: "أثاث", style: "تراثي", price: 5600, city: "الرياض", img: insp2, status: "منشور", views: 980, favs: 64, matches: 17 },
  { id: "p3", title: "ثريا كريستال متوسطة", category: "إضاءة", style: "كلاسيكي", price: 1850, city: "الرياض", img: insp3, status: "منشور", views: 612, favs: 32, matches: 9 },
  { id: "p4", title: "مكتبة جدارية بخشب البلوط", category: "أثاث", style: "حديث", price: 3100, city: "الرياض", img: insp4, status: "مسودة", views: 0, favs: 0, matches: 0 },
];

const SEED_INQUIRIES: Inquiry[] = [
  { id: "i1", customer: "منى أحمد", product: "سرير خشبي مزدوج بإطار طبيعي", message: "هل متوفّر بمقاس كنج؟ ومتى أقرب توصيل؟", city: "جدة", ago: "قبل ١٠ دقائق", status: "جديد", match: 96 },
  { id: "i2", customer: "خالد العتيبي", product: "ثريا كريستال متوسطة", message: "أحتاج قطعتين، فيه خصم على الاثنين؟", city: "الرياض", ago: "قبل ساعة", status: "قيد الرد", match: 88 },
  { id: "i3", customer: "ريم الحربي", product: "مجلس عربي مطرز بألوان دافئة", message: "ممكن صور أكثر للتفاصيل؟", city: "الدمام", ago: "أمس", status: "تم", match: 92 },
];

const CATEGORIES: Category[] = ["أثاث", "إضاءة", "سجاد", "ديكور", "مطبخ"];
const STYLES: Style[] = ["اسكندنافي", "تراثي", "كلاسيكي", "حديث", "بوهيمي"];

function VendorPage() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(SEED_INQUIRIES);
  const [tab, setTab] = useState("overview");

  // add product form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("أثاث");
  const [style, setStyle] = useState<Style>("حديث");
  const [price, setPrice] = useState<string>("");
  const [city, setCity] = useState("الرياض");
  const [desc, setDesc] = useState("");
  const [imgPreview, setImgPreview] = useState<string>("");

  const stats = useMemo(() => {
    const totalViews = products.reduce((s, p) => s + p.views, 0);
    const totalFavs = products.reduce((s, p) => s + p.favs, 0);
    const totalMatches = products.reduce((s, p) => s + p.matches, 0);
    const newInquiries = inquiries.filter((i) => i.status === "جديد").length;
    return { totalViews, totalFavs, totalMatches, newInquiries, published: products.filter((p) => p.status === "منشور").length };
  }, [products, inquiries]);

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImgPreview(url);
  }

  function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !price) {
      toast.error("اسم المنتج والسعر مطلوبان");
      return;
    }
    const p: Product = {
      id: `p${Date.now()}`,
      title: title.trim(),
      category, style,
      price: Number(price),
      city,
      img: imgPreview || insp5,
      status: "منشور",
      views: 0, favs: 0, matches: 0,
    };
    setProducts((prev) => [p, ...prev]);
    toast.success("تم نشر المنتج بنجاح");
    setTitle(""); setPrice(""); setDesc(""); setImgPreview("");
    setTab("products");
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("تم حذف المنتج");
  }

  function toggleStatus(id: string) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "منشور" ? "مسودة" : "منشور" } : p));
  }

  function replyInquiry(id: string) {
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status: "قيد الرد" } : i));
    toast.success("تم فتح المحادثة مع العميل");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster richColors position="top-center" />
      <SiteHeader />
      <main className="flex-1 pt-28 pb-20">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 shadow-elegant">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent mb-3">
                <Store className="size-4" /> بوابة الموردين
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                أهلاً، <span className="text-gradient-gold">ورشة الخشب</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                أدر منتجاتك، استقبل طلبات العملاء التي يطابقها وكيل الذكاء الاصطناعي مع تصاميمهم، وتابع أداءك في الوقت الحقيقي.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" onClick={() => setTab("add")}>
                  <Plus className="size-4" /> أضف منتجاً
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <Link to="/marketplace">
                    <ArrowLeft className="size-4" /> شاهد السوق
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex absolute -left-10 -bottom-10 gap-4 opacity-30">
              <img src={insp4} alt="" className="size-44 rounded-2xl object-cover rotate-6" />
              <img src={insp6} alt="" className="size-44 rounded-2xl object-cover -rotate-3" />
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Kpi icon={Eye} label="مشاهدات الشهر" value={stats.totalViews.toLocaleString("ar-EG")} delta="+12%" />
            <Kpi icon={Heart} label="الإعجابات" value={stats.totalFavs.toLocaleString("ar-EG")} delta="+8%" />
            <Kpi icon={Sparkles} label="مطابقات AI" value={stats.totalMatches.toLocaleString("ar-EG")} delta="+24%" gold />
            <Kpi icon={MessageCircle} label="رسائل جديدة" value={String(stats.newInquiries)} delta={stats.newInquiries > 0 ? "تحتاج رد" : "—"} />
          </div>
        </section>

        {/* Tabs */}
        <section className="mx-auto max-w-7xl px-4 mt-10">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
              <TabsTrigger value="overview"><BarChart3 className="size-4" /> نظرة عامة</TabsTrigger>
              <TabsTrigger value="products"><Package className="size-4" /> منتجاتي</TabsTrigger>
              <TabsTrigger value="inquiries"><MessageCircle className="size-4" /> الطلبات</TabsTrigger>
              <TabsTrigger value="add"><Plus className="size-4" /> منتج جديد</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-border/60">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="font-extrabold text-lg">أعلى المنتجات تطابقاً</h2>
                        <p className="text-sm text-muted-foreground">المنتجات التي يقترحها AI أكثر من غيرها</p>
                      </div>
                      <TrendingUp className="size-5 text-accent" />
                    </div>
                    <div className="space-y-3">
                      {[...products].sort((a, b) => b.matches - a.matches).slice(0, 4).map((p, i) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
                          <span className="size-7 rounded-full bg-gradient-gold text-gold-foreground grid place-items-center text-xs font-bold">{i + 1}</span>
                          <img src={p.img} alt="" className="size-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{p.title}</p>
                            <p className="text-xs text-muted-foreground">{p.category} · {p.style}</p>
                          </div>
                          <div className="text-left shrink-0">
                            <p className="text-sm font-bold text-accent">{p.matches}</p>
                            <p className="text-[10px] text-muted-foreground">مطابقة</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-5 text-accent" />
                      <h2 className="font-extrabold text-lg">حالة الحساب</h2>
                    </div>
                    <Row label="الاسم التجاري" value="ورشة الخشب" />
                    <Row label="المدينة" value="الرياض" />
                    <Row label="عدد المنتجات" value={`${products.length} (${stats.published} منشور)`} />
                    <Row label="التقييم" value={<span className="inline-flex items-center gap-1"><Star className="size-3.5 fill-gold text-gold" /> 4.8</span>} />
                    <div className="rounded-xl bg-accent/10 border border-accent/30 p-3 text-xs text-foreground/80 flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                      حسابك <strong className="text-foreground">موثّق</strong>. منتجاتك تظهر بشارة الثقة للعملاء.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products */}
            <TabsContent value="products" className="mt-6">
              {products.length === 0 ? (
                <Empty onAdd={() => setTab("add")} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p) => (
                    <Card key={p.id} className="overflow-hidden hover-lift group border-border/60 flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={p.img} alt={p.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-3 right-3">
                          <Badge className={p.status === "منشور" ? "bg-accent text-accent-foreground border-0" : "bg-muted text-muted-foreground border-0"}>
                            {p.status === "منشور" ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                            <span className="bg-secondary/60 px-2 py-0.5 rounded-full">{p.category}</span>
                            <span className="bg-secondary/60 px-2 py-0.5 rounded-full">{p.style}</span>
                          </div>
                          <h3 className="font-bold leading-tight">{p.title}</h3>
                          <p className="text-sm text-gradient-gold font-extrabold mt-1">{p.price.toLocaleString("ar-EG")} ر.س</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground border-y border-border/60 py-2">
                          <div><Eye className="size-3.5 mx-auto mb-0.5" />{p.views}</div>
                          <div><Heart className="size-3.5 mx-auto mb-0.5" />{p.favs}</div>
                          <div><Sparkles className="size-3.5 mx-auto mb-0.5 text-accent" />{p.matches}</div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleStatus(p.id)}>
                            <Pencil className="size-3.5" />
                            {p.status === "منشور" ? "إخفاء" : "نشر"}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeProduct(p.id)} aria-label="حذف">
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Inquiries */}
            <TabsContent value="inquiries" className="mt-6 space-y-3">
              {inquiries.map((i) => (
                <Card key={i.id} className="border-border/60">
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:w-44 shrink-0">
                      <div className="size-11 rounded-full bg-gradient-wood grid place-items-center text-primary-foreground font-bold">
                        {i.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{i.customer}</p>
                        <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <MapPin className="size-3" /> {i.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-gradient-gold text-gold-foreground border-0">
                          <Wand2 className="size-3" /> مطابقة {i.match}%
                        </Badge>
                        <Badge variant="secondary">{i.product}</Badge>
                        <span className="text-[11px] text-muted-foreground ms-auto">{i.ago}</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{i.message}</p>
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant={i.status === "تم" ? "outline" : "gold"}
                          size="sm"
                          onClick={() => replyInquiry(i.id)}
                          disabled={i.status === "تم"}
                        >
                          <MessageCircle className="size-4" />
                          {i.status === "تم" ? "تم الرد" : i.status === "قيد الرد" ? "متابعة المحادثة" : "رد على العميل"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="size-4" /> اتصال
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Add product */}
            <TabsContent value="add" className="mt-6">
              <Card className="border-border/60">
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h2 className="font-extrabold text-xl">أضف منتجاً جديداً</h2>
                    <p className="text-sm text-muted-foreground">سيقوم AI بمطابقته تلقائياً مع تصاميم العملاء.</p>
                  </div>

                  <form onSubmit={addProduct} className="grid md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <Label className="mb-2 block">صورة المنتج</Label>
                      <label className="relative block rounded-2xl border-2 border-dashed border-border hover:border-primary/40 transition-colors aspect-[16/6] overflow-hidden cursor-pointer bg-secondary/30">
                        {imgPreview ? (
                          <img src={imgPreview} alt="" className="size-full object-cover" />
                        ) : (
                          <div className="size-full grid place-items-center text-center p-4">
                            <div>
                              <Upload className="size-7 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-semibold">اسحب الصورة هنا أو اضغط للرفع</p>
                              <p className="text-xs text-muted-foreground mt-1">PNG / JPG حتى 5MB</p>
                            </div>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={onPickImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="p-title">اسم المنتج</Label>
                      <Input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: طاولة طعام خشبية بـ ٦ مقاعد" />
                    </div>

                    <div>
                      <Label htmlFor="p-cat">الفئة</Label>
                      <select id="p-cat" value={category} onChange={(e) => setCategory(e.target.value as Category)}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="p-style">النمط</Label>
                      <select id="p-style" value={style} onChange={(e) => setStyle(e.target.value as Style)}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="p-price">السعر (ر.س)</Label>
                      <Input id="p-price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" dir="ltr" />
                    </div>

                    <div>
                      <Label htmlFor="p-city">المدينة</Label>
                      <Input id="p-city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="p-desc">وصف مختصر</Label>
                      <Textarea id="p-desc" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)}
                        placeholder="المواد، الأبعاد، التشطيب…" />
                    </div>

                    <div className="md:col-span-2 flex gap-3 pt-2">
                      <Button type="submit" variant="hero" className="flex-1 sm:flex-none">
                        <Plus className="size-4" /> نشر المنتج
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => { setTitle(""); setPrice(""); setDesc(""); setImgPreview(""); }}>
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Kpi({ icon: Icon, label, value, delta, gold }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string, delta: string, gold?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4 hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className={`size-10 rounded-xl grid place-items-center ${gold ? "bg-gradient-gold text-gold-foreground" : "bg-secondary text-foreground"}`}>
          <Icon className="size-5" />
        </div>
        <span className="text-[11px] font-semibold text-accent">{delta}</span>
      </div>
      <p className="text-2xl font-extrabold leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-border/60 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Empty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="glass rounded-2xl p-16 text-center">
      <Package className="size-10 mx-auto mb-3 text-muted-foreground" />
      <p className="font-bold mb-1">لا توجد منتجات بعد</p>
      <p className="text-sm text-muted-foreground mb-4">أضف أول منتج ليظهر للعملاء.</p>
      <Button variant="hero" onClick={onAdd}><Plus className="size-4" /> أضف منتجاً</Button>
    </div>
  );
}
