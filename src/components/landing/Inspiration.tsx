import insp1 from "@/assets/insp-1.jpg";
import insp2 from "@/assets/insp-2.jpg";
import insp3 from "@/assets/insp-3.jpg";
import insp4 from "@/assets/insp-4.jpg";
import insp5 from "@/assets/insp-5.jpg";
import insp6 from "@/assets/insp-6.jpg";
import { Heart, Sparkles } from "lucide-react";

const items = [
  { img: insp1, title: "غرفة نوم دافئة", style: "اسكندنافي حديث", h: "h-80" },
  { img: insp2, title: "مجلس عربي", style: "تراثي معاصر", h: "h-64" },
  { img: insp3, title: "مطبخ كلاسيكي", style: "أنيق ومضيء", h: "h-72" },
  { img: insp4, title: "ركن قراءة", style: "هادئ وطبيعي", h: "h-96" },
  { img: insp5, title: "مكتب منزلي", style: "بسيط ومنظّم", h: "h-56" },
  { img: insp6, title: "حمام فاخر", style: "حجري دافئ", h: "h-80" },
];

export function Inspiration() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent mb-3">
              <Sparkles className="size-4" /> معرض الإلهام
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              تصاميم تنبض بالحياة، <span className="text-gradient-gold">من إلهامك</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            استلهم من آلاف التصاميم التي أنشأها مجتمعنا بالذكاء الاصطناعي، وأعد تخصيصها لتناسب مساحتك.
          </p>
        </div>

        <div className="columns-2 md:columns-3 gap-5 [column-fill:_balance]">
          {items.map((it, i) => (
            <article key={i} className={`group relative mb-5 break-inside-avoid rounded-2xl overflow-hidden ${it.h} shadow-soft hover-lift`}>
              <img src={it.img} alt={it.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button className="absolute top-3 left-3 size-9 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold/30">
                <Heart className="size-4" />
              </button>
              <div className="absolute bottom-0 inset-x-0 p-4 text-primary-foreground translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                <p className="font-bold">{it.title}</p>
                <p className="text-xs opacity-80">{it.style}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
