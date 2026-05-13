import { Star } from "lucide-react";

const items = [
  { name: "سارة أحمد", role: "مالكة منزل", quote: "في عشر دقائق، حصلت على تصميم لغرفة معيشتي يفوق ما كنت أتخيل. تواصلت مع المورد مباشرة وأنجزت كل شيء في أسبوع." },
  { name: "محمد العامري", role: "مورد أثاث", quote: "وصلت إلى عملاء حقيقيين يبحثون فعلاً عن منتجاتي. الفرق هائل عن الإعلانات التقليدية." },
  { name: "ليلى حسن", role: "مهندسة ديكور", quote: "أستخدم داري لتقديم خيارات سريعة لعملائي. توفر علي ساعات من الرسم والعرض." },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-right mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold">يحبّونه. <span className="text-gradient-gold">حقاً.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <figure key={i} className="glass rounded-3xl p-7 shadow-soft hover-lift">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="size-11 rounded-full bg-gradient-to-br from-gold to-accent" />
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
