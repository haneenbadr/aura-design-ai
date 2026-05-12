import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/layout/Placeholder";

export const Route = createFileRoute("/designs")({
  head: () => ({ meta: [{ title: "تصاميمي — داري" }] }),
  component: () => <Placeholder title="تصاميمي" desc="جميع مشاريعك المحفوظة في مكان واحد، جاهزة للتعديل والمشاركة." />,
});
