import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/layout/Placeholder";

export const Route = createFileRoute("/vendor")({
  head: () => ({ meta: [{ title: "بوابة الموردين — داري" }, { name: "description", content: "إدارة منتجاتك وتحليل أدائك كمورد." }] }),
  component: () => <Placeholder title="بوابة الموردين" desc="أنشئ ملفك، ارفع منتجاتك، وتابع تحليلات الأداء وعمليات المطابقة الذكية." />,
});
