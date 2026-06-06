import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Pencil, EyeOff, CheckCircle2, XCircle, Package } from "lucide-react";

export const Route = createFileRoute("/admin/products")({ component: ProductsPage });

const products = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: ["أريكة كلاسيكية", "طاولة طعام خشبية", "سرير مودرن", "كرسي مكتب", "خزانة ملابس",
         "طاولة قهوة دائرية", "وحدة تلفاز", "نجفة سقف", "مكتبة جدارية", "كرسي بار",
         "طاولة جانبية", "سرير أطفال"][i],
  vendor: ["أثاث الديوان", "روائع الخشب", "ركن البيت"][i % 3],
  category: ["أرائك", "طاولات طعام", "أسرّة", "كراسي مكتب"][i % 4],
  price: 1200 + i * 350,
  status: ["موافق", "بانتظار", "موافق", "مخفي"][i % 4],
}));

const tone: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
  "موافق": "secondary", "بانتظار": "default", "مخفي": "outline", "مرفوض": "destructive",
};

function ProductsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="إدارة المنتجات" description="5,612 منتج من 328 بائع" />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="ابحث في المنتجات..." className="pr-9" />
            </div>
            <Select><SelectTrigger className="w-40"><SelectValue placeholder="الفئة" /></SelectTrigger>
              <SelectContent><SelectItem value="all">كل الفئات</SelectItem><SelectItem value="sofa">أرائك</SelectItem><SelectItem value="bed">أسرّة</SelectItem></SelectContent>
            </Select>
            <Select><SelectTrigger className="w-40"><SelectValue placeholder="البائع" /></SelectTrigger>
              <SelectContent><SelectItem value="all">كل البائعين</SelectItem></SelectContent>
            </Select>
            <Select><SelectTrigger className="w-32"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent><SelectItem value="all">الكل</SelectItem><SelectItem value="ok">موافق</SelectItem><SelectItem value="w">بانتظار</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="overflow-hidden hover-lift group">
            <div className="aspect-[4/3] bg-gradient-hero relative grid place-items-center">
              <Package className="size-12 text-primary/30 group-hover:scale-110 transition" />
              <Badge variant={tone[p.status]} className="absolute top-2 right-2">{p.status}</Badge>
            </div>
            <CardContent className="p-3 space-y-2">
              <div>
                <h3 className="font-semibold text-sm leading-tight line-clamp-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.vendor} • {p.category}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold tabular-nums text-sm">{p.price} ر.س</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="size-7"><Pencil className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="size-7"><EyeOff className="size-3.5" /></Button>
                </div>
              </div>
              {p.status === "بانتظار" && (
                <div className="flex gap-1 pt-1 border-t">
                  <Button size="sm" variant="secondary" className="flex-1 h-7 text-xs"><CheckCircle2 className="size-3" />موافقة</Button>
                  <Button size="sm" variant="ghost" className="flex-1 h-7 text-xs text-destructive"><XCircle className="size-3" />رفض</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
