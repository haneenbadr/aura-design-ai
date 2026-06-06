import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="الإعدادات" description="إدارة تفضيلات المنصة" />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="notify">الإشعارات</TabsTrigger>
          <TabsTrigger value="platform">المنصة</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">معلومات المنصة</CardTitle>
              <CardDescription>الاسم العام وبيانات التواصل</CardDescription></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="اسم المنصة" defaultValue="داري للتصميم الداخلي" />
              <Field label="البريد الرسمي" defaultValue="hello@dari.ai" />
              <Field label="اللغة الافتراضية" defaultValue="العربية" />
              <Field label="المنطقة الزمنية" defaultValue="GMT+3 (الرياض)" />
              <div className="md:col-span-2">
                <Label className="text-xs mb-1.5 block">وصف المنصة</Label>
                <Textarea defaultValue="منصة ذكية تربط المستخدمين بالبائعين عبر تصاميم داخلية مُولَّدة بالذكاء الاصطناعي." />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end"><Button className="bg-gradient-wood">حفظ التغييرات</Button></div>
        </TabsContent>

        <TabsContent value="notify" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">قنوات الإشعار</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ["تنبيه عند تسجيل بائع جديد", true],
                ["تنبيه عند رفع منتج جديد", true],
                ["تنبيه عند توليد تصميم AI", false],
                ["تقرير يومي عبر البريد", true],
                ["تنبيهات هبوط أداء AI", true],
              ].map(([label, def]) => (
                <Row key={String(label)} label={String(label)} defaultChecked={Boolean(def)} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">إعدادات المنصة</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Row label="السماح بتسجيل بائعين جدد" defaultChecked />
              <Row label="مراجعة المنتجات قبل النشر" defaultChecked />
              <Row label="وضع الصيانة" defaultChecked={false} />
              <Row label="تفعيل التصاميم ثلاثية الأبعاد" defaultChecked />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div>
      <Label className="text-xs mb-1.5 block">{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}
function Row({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition">
      <Label className="cursor-pointer">{label}</Label>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
