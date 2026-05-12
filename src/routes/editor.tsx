import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/layout/Placeholder";

export const Route = createFileRoute("/editor")({
  head: () => ({ meta: [{ title: "المحرر ثلاثي الأبعاد — داري" }] }),
  component: () => <Placeholder title="محرر 2D / 3D" desc="حرّك الأثاث، عدّل الزوايا، وتجوّل داخل تصميمك ثلاثي الأبعاد." />,
});
