import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Trash2, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/designs")({ component: DesignsPage });

const designs = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  user: ["سارة الأحمدي", "محمد العلي", "نورة السبيعي", "خالد الزهراني"][i % 4],
  date: `2025-06-0${(i % 9) + 1}`,
  room: ["غرفة معيشة", "غرفة نوم", "مطبخ", "غرفة طعام"][i % 4],
  style: ["مودرن", "اسكندنافي", "كلاسيك", "بوهيمي"][i % 4],
}));

function DesignsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="التصاميم المُولّدة" description="18,940 تصميم تم توليده بواسطة AI" />

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Select><SelectTrigger className="w-40"><SelectValue placeholder="نوع الغرفة" /></SelectTrigger>
            <SelectContent><SelectItem value="all">الكل</SelectItem><SelectItem value="lv">غرفة معيشة</SelectItem><SelectItem value="bd">غرفة نوم</SelectItem></SelectContent>
          </Select>
          <Select><SelectTrigger className="w-40"><SelectValue placeholder="النمط" /></SelectTrigger>
            <SelectContent><SelectItem value="all">الكل</SelectItem><SelectItem value="m">مودرن</SelectItem><SelectItem value="c">كلاسيك</SelectItem></SelectContent>
          </Select>
          <Select><SelectTrigger className="w-40"><SelectValue placeholder="الفترة" /></SelectTrigger>
            <SelectContent><SelectItem value="all">كل الفترات</SelectItem><SelectItem value="7">آخر 7 أيام</SelectItem><SelectItem value="30">آخر 30 يوم</SelectItem></SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {designs.map((d) => (
          <Card key={d.id} className="overflow-hidden hover-lift group">
            <div className="aspect-square bg-gradient-hero grid place-items-center relative">
              <ImageIcon className="size-14 text-primary/30 group-hover:scale-110 transition" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3 gap-2">
                <Button size="sm" variant="secondary" className="flex-1"><Eye className="size-3.5" />عرض</Button>
                <Button size="sm" variant="ghost" className="text-destructive-foreground bg-destructive/80 hover:bg-destructive"><Trash2 className="size-3.5" /></Button>
              </div>
            </div>
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{d.user}</span>
                <Badge variant="secondary" className="text-[10px]">{d.style}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{d.room} • {d.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
