import { Upload, MessageCircle, Wand2, Box, Store } from "lucide-react";

const steps = [
  { icon: Upload, title: "ارفع غرفتك أو إلهامك", desc: "صورة واحدة تكفي. الذكاء الاصطناعي يفهم المساحة فوراً." },
  { icon: MessageCircle, title: "تحدّث مع المساعد", desc: "أخبره بأسلوبك، ميزانيتك، واحتياجاتك بلغة طبيعية." },
  { icon: Wand2, title: "ولّد التصميم", desc: "احصل على تصاميم متعددة بدقة عالية في ثوانٍ." },
  { icon: Box, title: "استكشف ثلاثي الأبعاد", desc: "تجوّل داخل غرفتك الجديدة، حرّك الأثاث، عدّل التفاصيل." },
  { icon: Store, title: "تواصل مع الموردين", desc: "اعثر على القطع الحقيقية من موردين موثوقين قريبين منك." },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-right mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent mb-3">
            كيف يعمل
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold">من الفكرة إلى الواقع في <span className="text-gradient-gold">٥ خطوات</span></h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="relative bg-card rounded-2xl p-6 shadow-soft hover-lift border border-border/50">
              <div className="absolute -top-3 right-5 text-6xl font-black text-gold/20 leading-none select-none">
                {(i + 1).toLocaleString("ar-EG")}
              </div>
              <div className="size-12 rounded-xl bg-gradient-wood grid place-items-center shadow-soft mb-4">
                <s.icon className="size-5 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
