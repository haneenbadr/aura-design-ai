import { Brain, Store, Layers, Box, Images, Wallet, Home } from "lucide-react";

const features = [
  { icon: Brain, title: "توليد تصاميم بالذكاء", desc: "نماذج رؤية متقدمة تفهم المساحة والإضاءة والأسلوب.", tone: "wood" },
  { icon: Store, title: "ربط ذكي بالموردين", desc: "نطابق كل قطعة بأقرب مورد بسعر وأبعاد مناسبة.", tone: "blue" },
  { icon: Layers, title: "تعديل ثنائي الأبعاد", desc: "اسحب، أفلت، وأعد ترتيب الأثاث على المخطط.", tone: "gold" },
  { icon: Box, title: "تجربة ثلاثية تفاعلية", desc: "تجوّل داخل التصميم وتفقد كل زاوية قبل التنفيذ.", tone: "wood" },
  { icon: Images, title: "دمج صور الإلهام", desc: "ارفع عدة مراجع، والذكاء يستخلص جوهر أسلوبك.", tone: "blue" },
  { icon: Wallet, title: "اقتراحات تراعي ميزانيتك", desc: "خيارات اقتصادية وفاخرة لكل قطعة في التصميم.", tone: "gold" },
  { icon: Home, title: "إعادة تصميم غرف حقيقية", desc: "ارفع صورة غرفتك الفعلية وشاهدها في حلتها الجديدة.", tone: "wood" },
];

const toneClass = {
  wood: "bg-gradient-wood text-primary-foreground",
  blue: "bg-gradient-blue text-primary-foreground",
  gold: "bg-gradient-gold text-gold-foreground",
} as const;

export function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold">قدرات تجعل الفرق <span className="text-gradient-gold">واضحاً</span></h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">كل ما تحتاجه لتصميم منزلك كمحترف، بدون أي خبرة سابقة.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="group bg-card rounded-2xl p-6 border border-border/60 hover-lift">
              <div className={`size-12 rounded-xl grid place-items-center shadow-soft mb-4 ${toneClass[f.tone as keyof typeof toneClass]}`}>
                <f.icon className="size-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
