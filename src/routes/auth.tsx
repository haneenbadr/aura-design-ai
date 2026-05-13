import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Sparkles, Mail, Lock, User, Store, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/sonner";
import authBg from "@/assets/hero-room.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — داري" },
      { name: "description", content: "ادخل إلى حسابك أو أنشئ حساباً جديداً للبدء." },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().trim().email({ message: "بريد غير صالح" }).max(255),
  password: z.string().min(6, { message: "كلمة المرور 6 أحرف على الأقل" }).max(72),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "الاسم قصير جداً" }).max(80),
  email: z.string().trim().email({ message: "بريد غير صالح" }).max(255),
  password: z.string().min(6, { message: "كلمة المرور 6 أحرف على الأقل" }).max(72),
  role: z.enum(["customer", "vendor"]),
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "vendor">("customer");

  // redirect if already signed in
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) navigate({ to: "/design" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/design" });
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      const msg = error.message.includes("Invalid login")
        ? "بيانات الدخول غير صحيحة"
        : error.message.includes("Email not confirmed")
          ? "من فضلك أكّد بريدك الإلكتروني أولاً"
          : error.message;
      toast.error(msg);
      return;
    }
    toast.success("أهلاً بعودتك");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ fullName: name, email, password, role });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          full_name: parsed.data.fullName,
          role: parsed.data.role,
        },
      },
    });
    setLoading(false);
    if (error) {
      const msg = error.message.includes("registered")
        ? "هذا البريد مسجّل بالفعل"
        : error.message;
      toast.error(msg);
      return;
    }
    toast.success("تم إنشاء حسابك! تحقق من بريدك لتأكيد الحساب");
    setTab("login");
  }

  async function handleGoogle() {
    setOauthLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setOauthLoading(false);
      toast.error("تعذّر تسجيل الدخول عبر Google");
      return;
    }
    if (result.redirected) return;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <Toaster richColors position="top-center" />
      {/* Soft, faded background image */}
      <div
        className="absolute inset-0 -z-20 bg-center bg-cover opacity-25 blur-[2px] scale-105"
        style={{ backgroundImage: `url(${authBg})` }}
        aria-hidden
      />
      {/* Color wash on top of the image */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/70 to-background/95" aria-hidden />
      {/* Decorative glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 size-[520px] rounded-full bg-gradient-wood opacity-25 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[520px] rounded-full bg-gold/25 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[380px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-md px-4 py-12 min-h-screen flex flex-col justify-center">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8 group">
          <div className="size-11 rounded-xl bg-gradient-wood grid place-items-center shadow-soft group-hover:shadow-glow transition-shadow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-xl">داري</span>
            <span className="text-[11px] text-muted-foreground -mt-0.5">AI Interior</span>
          </div>
        </Link>

        <div className="glass rounded-3xl p-6 sm:p-8 shadow-soft animate-fade-up">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="text-center mb-2">
                <h1 className="text-2xl font-extrabold">أهلاً بعودتك</h1>
                <p className="text-sm text-muted-foreground mt-1">سجّل دخولك لمتابعة تصاميمك</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Field id="login-email" label="البريد الإلكتروني" icon={<Mail className="size-4" />}>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field id="login-password" label="كلمة المرور" icon={<Lock className="size-4" />}>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    dir="ltr"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </Field>

                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  دخول
                </Button>
              </form>

              <Divider />
              <GoogleButton loading={oauthLoading} onClick={handleGoogle} />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="text-center mb-2">
                <h1 className="text-2xl font-extrabold">أنشئ حسابك</h1>
                <p className="text-sm text-muted-foreground mt-1">ابدأ تصميم مساحتك بالذكاء الاصطناعي</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <Field id="su-name" label="الاسم الكامل" icon={<User className="size-4" />}>
                  <Input
                    id="su-name"
                    type="text"
                    autoComplete="name"
                    placeholder="مثال: منى أحمد"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={80}
                  />
                </Field>

                <Field id="su-email" label="البريد الإلكتروني" icon={<Mail className="size-4" />}>
                  <Input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field id="su-password" label="كلمة المرور" icon={<Lock className="size-4" />}>
                  <Input
                    id="su-password"
                    type="password"
                    autoComplete="new-password"
                    dir="ltr"
                    placeholder="6 أحرف على الأقل"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                <div className="space-y-2">
                  <Label>نوع الحساب</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(v) => setRole(v as "customer" | "vendor")}
                    className="grid grid-cols-2 gap-3"
                  >
                    <RoleCard
                      value="customer"
                      checked={role === "customer"}
                      icon={<User className="size-4" />}
                      title="عميل"
                      desc="أصمّم غرفتي"
                    />
                    <RoleCard
                      value="vendor"
                      checked={role === "vendor"}
                      icon={<Store className="size-4" />}
                      title="مورد"
                      desc="أعرض منتجاتي"
                    />
                  </RadioGroup>
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  إنشاء الحساب
                </Button>
              </form>

              <Divider />
              <GoogleButton loading={oauthLoading} onClick={handleGoogle} />
              <p className="text-[11px] text-muted-foreground text-center">
                بإنشاء حساب فأنت توافق على الشروط وسياسة الخصوصية
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">← العودة للرئيسية</Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-foreground/80">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </Label>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px bg-border flex-1" />
      <span className="text-xs text-muted-foreground">أو</span>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}

function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" className="w-full" onClick={onClick} disabled={loading}>
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38Z" />
        </svg>
      )}
      المتابعة باستخدام Google
    </Button>
  );
}

function RoleCard({
  value,
  checked,
  icon,
  title,
  desc,
}: {
  value: string;
  checked: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Label
      htmlFor={`role-${value}`}
      className={`relative cursor-pointer rounded-xl border-2 p-3 flex flex-col gap-1 transition-all ${
        checked
          ? "border-primary bg-primary/5 shadow-soft"
          : "border-border hover:border-primary/40"
      }`}
    >
      <RadioGroupItem id={`role-${value}`} value={value} className="sr-only" />
      <div className="flex items-center gap-2">
        <span className={checked ? "text-primary" : "text-muted-foreground"}>{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <span className="text-[11px] text-muted-foreground">{desc}</span>
    </Label>
  );
}
