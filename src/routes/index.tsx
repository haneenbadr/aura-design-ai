import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/landing/Hero";
import { Inspiration } from "@/components/landing/Inspiration";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "داري — صمم غرفتك بالذكاء الاصطناعي" },
      { name: "description", content: "منصة ذكية لتصميم الغرف بالذكاء الاصطناعي وربطك بالموردين المناسبين. تصاميم ثنائية وثلاثية الأبعاد في دقائق." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Inspiration />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}
