import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wand2 } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-wood shadow-elegant p-10 md:p-16 text-right">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-gold) 0, transparent 40%), radial-gradient(circle at 80% 80%, var(--color-accent) 0, transparent 40%)",
          }} />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground leading-tight">
              منزلك يستحق تصميماً<br />يشبهك تماماً
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl">
              ابدأ مجاناً الآن. لا حاجة لبطاقة ائتمان، فقط شغفك بالتصميم.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
              <Button variant="gold" size="xl" asChild>
                <Link to="/design"><Wand2 className="size-5" />جرّب داري الآن<ArrowLeft className="size-4" /></Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/vendor">انضم كمورد</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
