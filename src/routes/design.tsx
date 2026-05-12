import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/layout/Placeholder";

export const Route = createFileRoute("/design")({
  head: () => ({ meta: [{ title: "صمم غرفتك — داري" }, { name: "description", content: "ابدأ تصميم غرفتك بمساعدة الذكاء الاصطناعي." }] }),
  component: () => <Placeholder title="معالج التصميم الذكي" desc="ارفع صورة غرفتك أو شارك إلهامك، ودع المساعد الذكي يحوّل أفكارك إلى تصميم متكامل." />,
});
