import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/layout/Placeholder";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — داري" }] }),
  component: () => <Placeholder title="تسجيل الدخول" desc="ادخل إلى حسابك أو أنشئ حساباً جديداً للبدء." />,
});
