import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, MessageSquare, Package, Store } from "lucide-react";

export const Route = createFileRoute("/admin/approvals")({ component: ApprovalsPage });

const pendingVendors = [
  { id: "v1", name: "ستوديو السكن", email: "hi@sakan.studio", date: "2025-06-01", products: 0, owner: "هند العتيبي" },
  { id: "v2", name: "روائع الخشب", email: "sales@rawae3.sa", date: "2025-05-22", products: 12, owner: "ماجد القرني" },
  { id: "v3", name: "ركن الفن", email: "art@rukn.sa", date: "2025-05-30", products: 4, owner: "نوف الحربي" },
];
const pendingProducts = [
  { id: "p1", name: "أريكة جلدية فاخرة", vendor: "أثاث الديوان", price: 4500, category: "أرائك" },
  { id: "p2", name: "طاولة طعام رخامية", vendor: "روائع الخشب", price: 6200, category: "طاولات طعام" },
  { id: "p3", name: "سرير ملكي", vendor: "ركن البيت", price: 8900, category: "أسرّة" },
];

function ApprovalsPage() {
  const [selVendor, setSelVendor] = useState(pendingVendors[0]);
  const [selProduct, setSelProduct] = useState(pendingProducts[0]);

  return (
    <div className="space-y-5">
      <PageHeader title="مركز الموافقات" description="مراجعة الطلبات المعلّقة بسرعة وكفاءة" />

      <Tabs defaultValue="vendors">
        <TabsList>
          <TabsTrigger value="vendors">بائعون بانتظار <Badge variant="secondary" className="mr-2">{pendingVendors.length}</Badge></TabsTrigger>
          <TabsTrigger value="products">منتجات بانتظار <Badge variant="secondary" className="mr-2">{pendingProducts.length}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Card className="lg:col-span-2">
              <CardContent className="p-2 space-y-1">
                {pendingVendors.map((v) => (
                  <button key={v.id} onClick={() => setSelVendor(v)}
                    className={`w-full text-right p-3 rounded-lg transition flex items-center gap-3 ${selVendor.id === v.id ? "bg-secondary" : "hover:bg-muted/60"}`}>
                    <Avatar className="size-9"><AvatarFallback className="bg-gradient-gold text-gold-foreground text-xs">{v.name[0]}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{v.name}</p>
                      <p className="text-[11px] text-muted-foreground">{v.email}</p>
                    </div>
                    <Store className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="size-14"><AvatarFallback className="bg-gradient-wood text-primary-foreground">{selVendor.name[0]}</AvatarFallback></Avatar>
                  <div>
                    <h2 className="text-lg font-bold">{selVendor.name}</h2>
                    <p className="text-sm text-muted-foreground">{selVendor.email}</p>
                    <Badge variant="outline" className="mt-2">قُدّم في {selVendor.date}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="المالك" value={selVendor.owner} />
                  <Field label="المنتجات المُعدّة" value={String(selVendor.products)} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2">ملاحظة (اختياري)</p>
                  <Textarea placeholder="اكتب ملاحظة للبائع..." />
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button className="flex-1 bg-gradient-wood"><CheckCircle2 className="size-4" />موافقة</Button>
                  <Button variant="outline" className="flex-1"><MessageSquare className="size-4" />طلب تعديلات</Button>
                  <Button variant="ghost" className="flex-1 text-destructive"><XCircle className="size-4" />رفض</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Card className="lg:col-span-2">
              <CardContent className="p-2 space-y-1">
                {pendingProducts.map((p) => (
                  <button key={p.id} onClick={() => setSelProduct(p)}
                    className={`w-full text-right p-3 rounded-lg transition flex items-center gap-3 ${selProduct.id === p.id ? "bg-secondary" : "hover:bg-muted/60"}`}>
                    <div className="size-10 rounded-lg bg-gradient-hero grid place-items-center"><Package className="size-4 text-primary/50" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.vendor}</p>
                    </div>
                    <span className="text-xs font-bold tabular-nums">{p.price} ر.س</span>
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardContent className="p-5 space-y-4">
                <div className="aspect-[16/9] rounded-xl bg-gradient-hero grid place-items-center">
                  <Package className="size-16 text-primary/40" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selProduct.name}</h2>
                  <p className="text-sm text-muted-foreground">{selProduct.vendor} • {selProduct.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="السعر" value={`${selProduct.price} ر.س`} />
                  <Field label="الفئة" value={selProduct.category} />
                </div>
                <Textarea placeholder="ملاحظة للبائع..." />
                <div className="flex gap-2 pt-2 border-t">
                  <Button className="flex-1 bg-gradient-wood"><CheckCircle2 className="size-4" />موافقة</Button>
                  <Button variant="outline" className="flex-1"><MessageSquare className="size-4" />طلب تعديلات</Button>
                  <Button variant="ghost" className="flex-1 text-destructive"><XCircle className="size-4" />رفض</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/40">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-semibold mt-0.5">{value}</p>
    </div>
  );
}
