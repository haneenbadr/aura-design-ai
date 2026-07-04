import { Link } from "@tanstack/react-router";
import { Sparkles, Wand2, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-room.jpg";
import insp1 from "@/assets/insp-1.jpg";
import insp3 from "@/assets/insp-3.jpg";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-gradient-hero">
      {/* Animated blueprint grid */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Floating gold orbs */}
      <div className="absolute top-32 -right-20 size-72 rounded-full bg-gradient-gold opacity-30 blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 -left-20 size-96 rounded-full bg-accent/25 blur-3xl animate-float" />

      <div className="relative mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <div className="text-right animate-fade-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 shadow-soft">
            <span className="size-2 rounded-full bg-gold animate-pulse-glow" />
            <span className="text-xs font-medium">مدعوم بالذكاء الاصطناعي • جديد</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
            صمّم غرفة أحلامك
            <br />
            <span className="text-gradient-gold">بذكاء اصطناعي</span>
            <br />
            يفهم ذوقك
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            ارفع صورة غرفتك أو شارك إلهامك، ودعنا نعيد تخيلها بتصاميم ثنائية وثلاثية الأبعاد، ثم نربطك بأفضل الموردين القريبين منك.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/design">
                <Wand2 className="size-5" />
                ابدأ التصميم مجاناً
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/marketplace">
                <Play className="size-4" />
                استكشف الإلهام
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-start gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-8 rounded-full border-2 border-background bg-gradient-to-br from-gold to-accent" />
                ))}
              </div>
              <span><b className="text-foreground">+12,000</b> مصمم نشط</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Sparkles className="size-4 text-gold" />
              <span>تقييم 4.9/5</span>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative h-[460px] sm:h-[560px] animate-fade-in">
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-elegant">
            <img src={heroImg} alt="غرفة معيشة مصممة بالذكاء الاصطناعي" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>

          {/* Floating preview cards */}
          <div className="absolute -top-4 -right-4 sm:-right-8 w-44 rounded-2xl glass shadow-elegant p-2 animate-float">
            <img src={insp1} alt="" className="w-full h-28 object-cover rounded-xl" />
            <div className="px-1 pt-2 pb-1">
              <p className="text-xs font-semibold">غرفة نوم دافئة</p>
              <p className="text-[10px] text-muted-foreground">تطابق 96%</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 sm:-left-10 w-52 rounded-2xl glass shadow-elegant p-2 animate-float-slow">
            <img src={insp3} alt="" className="w-full h-32 object-cover rounded-xl" />
            <div className="px-1 pt-2 pb-1 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold">مطبخ كلاسيكي</p>
                <p className="text-[10px] text-muted-foreground">12 مورد قريب</p>
              </div>
              <span className="text-[10px] bg-gold/20 text-gold-foreground px-2 py-0.5 rounded-full font-semibold">جديد</span>
            </div>
          </div>

          {/* Free vs Pro — compact single pill */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-10 glass rounded-full shadow-soft px-3 py-1.5 hidden md:flex items-center gap-3 animate-float text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="font-semibold">مجاني</span>
              <span className="text-muted-foreground">٥ تصاميم</span>
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-gold" />
              <span className="font-semibold">برو</span>
              <span className="text-muted-foreground">غير محدود</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
