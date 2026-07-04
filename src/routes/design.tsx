import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/design/StepIndicator";
import { UploadZone } from "@/components/design/UploadZone";
import { AssistantCard } from "@/components/design/AssistantCard";
import {
  ArrowRight, ArrowLeft, Sparkles, Wand2, Send, Mic,
  Bed, Sofa, ChefHat, Briefcase, Bath, Loader2, Check, AlertCircle,
} from "lucide-react";

const ENCOURAGEMENTS = [
  "✅ اختيار موفق!",
  "✅ رائع، لنكمل.",
  "✅ ممتاز، أصبحت لدي صورة أوضح عن التصميم الذي تريده.",
  "✅ هذا سيساعدني في إنشاء تصميم أدق.",
  "✨ خطوة أخرى ونقترب من تصميمك.",
];

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [
      { title: "صمم غرفتك — داري" },
      { name: "description", content: "ابدأ تصميم غرفتك بمساعدة الذكاء الاصطناعي خطوة بخطوة." },
    ],
  }),
  component: DesignWizard,
});

const STEPS = ["نوع الغرفة", "الصور", "الأسلوب", "تفضيلات", "التوليد"];

const ROOM_TYPES = [
  { id: "living", icon: Sofa, label: "غرفة معيشة" },
  { id: "bedroom", icon: Bed, label: "غرفة نوم" },
  { id: "kitchen", icon: ChefHat, label: "مطبخ" },
  { id: "office", icon: Briefcase, label: "مكتب" },
  { id: "bath", icon: Bath, label: "حمام" },
];

const STYLES = [
  { id: "modern", label: "حديث", desc: "خطوط نظيفة ومساحات مفتوحة", grad: "from-accent/30 to-accent/5" },
  { id: "classic", label: "كلاسيكي عربي", desc: "تفاصيل تراثية دافئة", grad: "from-gold/40 to-gold/5" },
  { id: "minimal", label: "بسيط", desc: "أقل هو أكثر، هدوء بصري", grad: "from-muted to-secondary/30" },
  { id: "luxury", label: "فاخر", desc: "خامات راقية ولمسات ذهبية", grad: "from-primary/20 to-gold/10" },
  { id: "scandinavian", label: "اسكندنافي", desc: "خشب فاتح وإضاءة طبيعية", grad: "from-secondary/60 to-background" },
  { id: "industrial", label: "صناعي", desc: "معادن وطوب مكشوف", grad: "from-primary/30 to-primary/5" },
];

const PROMPT_CHIPS = [
  "إضاءة دافئة طبيعية", "نباتات داخلية", "مساحة عائلية",
  "للأطفال", "ميزانية اقتصادية", "مساحة صغيرة",
  "ألوان هادئة", "لمسات ذهبية", "خامات خشبية",
];

function DesignWizard() {
  const [step, setStep] = useState(0);
  const [room, setRoom] = useState<string>("");
  const [files, setFiles] = useState<{ url: string; name: string }[]>([]);
  const [style, setStyle] = useState<string>("");
  const [budget, setBudget] = useState(50);
  const [prompt, setPrompt] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canNext =
    (step === 0 && room) ||
    (step === 1) || // skip allowed
    (step === 2 && style) ||
    (step === 3) ||
    step === 4;

  const next = async () => {
    if (step === 4) {
      setGenerating(true);
      setError(null);
      toast("🎨 بدأت في تجهيز تصميمك…", { duration: 2500 });
      // محاكاة توليد التصميم — اربط backend هنا
      await new Promise((r) => setTimeout(r, 1200));
      const imageUrl = "https://picsum.photos/seed/dari-design/1024/640";
      setGenerating(false);
      try { sessionStorage.setItem("dari:lastDesign", imageUrl); } catch {}
      setResultUrl(imageUrl);
      setDone(true);
      return;
    }
    const msg = ENCOURAGEMENTS[Math.min(step, ENCOURAGEMENTS.length - 1)];
    toast(msg, { duration: 2000 });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleChip = (c: string) =>
    setChips((arr) => arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 shadow-soft">
              <Sparkles className="size-3.5 text-gold" />
              <span className="text-xs font-medium">المعالج الذكي</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              لنصمم <span className="text-gradient-gold">غرفتك</span> معاً
            </h1>
            <p className="mt-2 text-muted-foreground">مصممك الذكي بيرشدك خطوة بخطوة — بدون تعقيد</p>
          </div>

          {/* Progress */}
          <div className="mb-10">
            <StepIndicator steps={STEPS} current={step} />
          </div>

          {/* Card */}
          <div className="bg-card rounded-3xl shadow-elegant border border-border/60 p-6 md:p-10">
            {step === 0 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold mb-2">ما نوع المساحة التي تصممها؟</h2>
                <p className="text-muted-foreground mb-6">اختر نوع الغرفة لتخصيص الاقتراحات</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {ROOM_TYPES.map((r) => {
                    const active = room === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRoom(r.id)}
                        className={[
                          "rounded-2xl p-5 border-2 transition-all hover-lift text-center",
                          active
                            ? "border-gold bg-gold/10 shadow-glow"
                            : "border-border hover:border-gold/40 bg-card",
                        ].join(" ")}
                      >
                        <div className={`size-12 mx-auto rounded-xl grid place-items-center mb-3 ${active ? "bg-gradient-gold text-gold-foreground" : "bg-secondary"}`}>
                          <r.icon className="size-5" />
                        </div>
                        <p className="font-semibold text-sm">{r.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold mb-2">ارفع صور غرفتك أو إلهامك</h2>
                <p className="text-muted-foreground mb-6">
                  يمكنك تخطّي هذه الخطوة والبدء من الصفر
                </p>
                <UploadZone files={files} onChange={setFiles} />
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold mb-2">ما الأسلوب الذي يناسبك؟</h2>
                <p className="text-muted-foreground mb-6">اختر الأسلوب الأقرب إلى ذوقك</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STYLES.map((s) => {
                    const active = style === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={[
                          "relative rounded-2xl p-5 border-2 text-right transition-all overflow-hidden hover-lift",
                          active
                            ? "border-gold shadow-glow"
                            : "border-border hover:border-gold/40",
                        ].join(" ")}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.grad} opacity-70`} />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">{s.label}</h3>
                            {active && (
                              <div className="size-6 rounded-full bg-gradient-gold grid place-items-center">
                                <Check className="size-3.5 text-gold-foreground" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{s.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-up space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">أخبرنا أكثر</h2>
                  <p className="text-muted-foreground mb-6">تفاصيل تساعد الذكاء الاصطناعي على فهمك</p>
                </div>

                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: غرفة معيشة مريحة لعائلة من ٤، تفضّل الألوان الترابية مع لمسة من الأزرق..."
                    rows={4}
                    className="w-full rounded-2xl border border-input bg-background p-4 pl-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/50 transition-shadow"
                  />
                  <button className="absolute bottom-3 left-3 size-9 rounded-xl bg-secondary hover:bg-gold/20 grid place-items-center transition-colors">
                    <Mic className="size-4" />
                  </button>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3">اقتراحات سريعة</p>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_CHIPS.map((c) => {
                      const active = chips.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleChip(c)}
                          className={[
                            "px-4 py-2 rounded-full text-xs font-medium border transition-all",
                            active
                              ? "bg-gradient-gold text-gold-foreground border-transparent shadow-soft"
                              : "bg-card border-border hover:border-gold/40 hover:bg-secondary/50",
                          ].join(" ")}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">الميزانية التقريبية</p>
                    <span className="text-sm font-bold text-gradient-gold">
                      {(budget * 100).toLocaleString("ar-EG")} ريال
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={500}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[oklch(0.76_0.085_75)]"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>اقتصادي</span><span>متوسط</span><span>فاخر</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && !done && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold mb-2">مراجعة وتأكيد</h2>
                <p className="text-muted-foreground mb-6">تحقق من اختياراتك قبل التوليد</p>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  <SummaryRow label="نوع الغرفة" value={ROOM_TYPES.find(r => r.id === room)?.label || "—"} />
                  <SummaryRow label="الأسلوب" value={STYLES.find(s => s.id === style)?.label || "—"} />
                  <SummaryRow label="الصور المرفوعة" value={files.length ? `${files.length.toLocaleString("ar-EG")} صورة` : "بدون"} />
                  <SummaryRow label="الميزانية" value={`${(budget * 100).toLocaleString("ar-EG")} ريال`} />
                  {chips.length > 0 && (
                    <SummaryRow label="التفضيلات" value={chips.join("، ")} full />
                  )}
                  {prompt && <SummaryRow label="ملاحظات" value={prompt} full />}
                </div>

                {generating && (
                  <div className="rounded-2xl bg-gradient-hero p-8 text-center border border-gold/30 animate-fade-in">
                    <div className="relative mx-auto size-20 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-gold animate-pulse-glow" />
                      <Loader2 className="absolute inset-0 m-auto size-10 text-gold-foreground animate-spin" />
                    </div>
                    <p className="font-bold text-lg">الذكاء الاصطناعي يصمم غرفتك...</p>
                    <p className="text-sm text-muted-foreground mt-1">قد يستغرق ذلك حتى دقيقة</p>
                  </div>
                )}

                {error && !generating && (
                  <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-5 flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-destructive">{error}</p>
                      <p className="text-sm text-muted-foreground mt-1">يمكنك إعادة المحاولة من زر "ولّد التصميم"</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && done && (
              <div className="animate-fade-up text-center py-2">
                <div className="size-14 mx-auto rounded-2xl bg-gradient-gold grid place-items-center shadow-glow mb-4">
                  <Check className="size-7 text-gold-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">تصميمك جاهز!</h2>
                <p className="text-muted-foreground mb-6">إليك التصميم الذي ولّده الذكاء الاصطناعي</p>

                {resultUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-elegant border border-border/60 mb-6 max-w-2xl mx-auto">
                    <img src={resultUrl} alt="تصميم غرفتك" className="w-full h-auto" />
                  </div>
                )}

                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/editor" search={{ room, style }}>
                      افتح في المحرر <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="glass" size="lg" onClick={() => { setStep(0); setDone(false); setResultUrl(null); }}>
                    تصميم آخر
                  </Button>
                </div>
              </div>
            )}

            {/* Footer actions */}
            {!done && (
              <div className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  onClick={back}
                  disabled={step === 0 || generating}
                >
                  <ArrowRight className="size-4" />
                  رجوع
                </Button>

                <div className="flex items-center gap-3">
                  {step === 1 && files.length === 0 && (
                    <Button variant="ghost" onClick={next} disabled={generating}>
                      تخطّي
                    </Button>
                  )}
                  <Button
                    variant={step === 4 ? "gold" : "hero"}
                    size="lg"
                    onClick={next}
                    disabled={!canNext || generating}
                  >
                    {step === 4 ? (
                      <>
                        <Wand2 className="size-4" />
                        ولّد التصميم
                      </>
                    ) : (
                      <>
                        التالي
                        <Send className="size-4 -scale-x-100" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SummaryRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`rounded-xl bg-secondary/40 p-4 ${full ? "sm:col-span-2" : ""}`}>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}
