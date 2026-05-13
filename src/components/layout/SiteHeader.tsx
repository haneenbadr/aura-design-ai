import { Link } from "@tanstack/react-router";
import { Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/design", label: "صمم غرفتك" },
  { to: "/designs", label: "تصاميمي" },
  { to: "/marketplace", label: "السوق" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-soft">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-9 rounded-xl bg-gradient-wood grid place-items-center shadow-soft group-hover:shadow-glow transition-shadow">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg tracking-tight">داري</span>
              <span className="text-[10px] text-muted-foreground -mt-0.5">AI Interior</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
                activeProps={{ className: "text-foreground bg-secondary/60" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/design">ابدأ التصميم</Link>
            </Button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden size-9 grid place-items-center rounded-lg hover:bg-secondary/50"
            aria-label="القائمة"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-3 flex flex-col gap-1 animate-fade-up">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-secondary/50 text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="ghost" size="sm" asChild><Link to="/auth">دخول</Link></Button>
              <Button variant="hero" size="sm" asChild><Link to="/design">ابدأ</Link></Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
