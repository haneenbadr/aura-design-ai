import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export function makePlaceholderRoute(path: string, title: string, desc: string) {
  return {
    head: () => ({
      meta: [
        { title: `${title} — داري` },
        { name: "description", content: desc },
      ],
    }),
    component: () => <Placeholder title={title} desc={desc} />,
  };
}

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-4 pt-32 pb-16">
        <div className="max-w-xl text-center glass rounded-3xl p-10 shadow-elegant">
          <div className="size-16 mx-auto rounded-2xl bg-gradient-gold grid place-items-center shadow-glow mb-6">
            <Construction className="size-7 text-gold-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{title}</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">{desc}</p>
          <p className="text-sm text-muted-foreground mb-6">
            هذه الصفحة قيد التطوير. اطلب من المساعد بناء تجربة هذه الصفحة بالكامل في الخطوة التالية.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/">العودة للرئيسية</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// Re-export for routes — used by route files via createFileRoute
export const Route = createFileRoute("/_placeholder-base" as never)({
  component: () => null,
});
