import { Link } from "@tanstack/react-router";
import { Sparkles, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-gradient-wood grid place-items-center shadow-soft">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl">داري</span>
              <span className="text-xs text-muted-foreground">AI Interior Design</span>
            </div>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            منصة ذكية تساعدك على تصميم غرفتك باستخدام الذكاء الاصطناعي وتربطك مباشرة بالموردين المناسبين لأسلوبك وميزانيتك.
          </p>
          <div className="flex gap-2 mt-6">
            {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="size-10 grid place-items-center rounded-xl bg-secondary/60 hover:bg-gold/20 text-foreground/70 hover:text-foreground transition-colors">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4">المنتج</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/design" className="hover:text-foreground">صمم غرفتك</Link></li>
            <li><Link to="/marketplace" className="hover:text-foreground">السوق</Link></li>
            <li><Link to="/editor" className="hover:text-foreground">المحرر ثلاثي الأبعاد</Link></li>
            <li><Link to="/designs" className="hover:text-foreground">تصاميمي</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">للموردين</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/vendor" className="hover:text-foreground">انضم كمورد</Link></li>
            <li><Link to="/vendor" className="hover:text-foreground">لوحة التحكم</Link></li>
            <li><a href="#" className="hover:text-foreground">دليل الموردين</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} داري. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">الشروط</a>
            <a href="#" className="hover:text-foreground">الخصوصية</a>
            <a href="#" className="hover:text-foreground">تواصل معنا</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
