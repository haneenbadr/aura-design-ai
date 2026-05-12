import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/layout/Placeholder";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "السوق — داري" }, { name: "description", content: "استكشف منتجات الموردين الموثوقين المطابقة لتصاميمك." }] }),
  component: () => <Placeholder title="سوق الموردين" desc="اكتشف قطع أثاث وديكور حقيقية من موردين موثوقين، مع نسبة تطابق ذكية مع تصاميمك." />,
});
