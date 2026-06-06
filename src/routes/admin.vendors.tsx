import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreHorizontal, Eye, CheckCircle2, XCircle, Ban } from "lucide-react";

export const Route = createFileRoute("/admin/vendors")({ component: VendorsPage });

const vendors = [
  { id: 1, name: "أثاث الديوان", email: "info@dewan.sa", products: 142, status: "موافق", date: "2025-01-10" },
  { id: 2, name: "روائع الخشب", email: "sales@rawae3.sa", products: 87, status: "بانتظار", date: "2025-05-22" },
  { id: 3, name: "ركن البيت", email: "contact@rukn.sa", products: 56, status: "موافق", date: "2025-02-04" },
  { id: 4, name: "ستوديو السكن", email: "hi@sakan.studio", products: 31, status: "بانتظار", date: "2025-06-01" },
  { id: 5, name: "هاوس آرت", email: "team@houseart.sa", products: 198, status: "موقوف", date: "2024-12-18" },
  { id: 6, name: "نجارة العصر", email: "asr@najara.sa", products: 64, status: "موافق", date: "2025-03-15" },
  { id: 7, name: "ديكور بلس", email: "plus@decor.sa", products: 22, status: "مرفوض", date: "2025-04-30" },
];

const tone: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
  "موافق": "secondary", "بانتظار": "default", "موقوف": "destructive", "مرفوض": "outline",
};

function VendorsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="إدارة البائعين" description="328 بائع نشط على المنصة" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="بحث عن بائع..." className="pr-9" />
            </div>
            <Button variant="outline" size="sm"><Filter className="size-4" />الفلاتر</Button>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>البائع</TableHead>
                  <TableHead>البريد</TableHead>
                  <TableHead>عدد المنتجات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8"><AvatarFallback className="text-xs bg-gradient-gold text-gold-foreground">{v.name[0]}</AvatarFallback></Avatar>
                        <span className="font-medium">{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.email}</TableCell>
                    <TableCell className="tabular-nums font-medium">{v.products}</TableCell>
                    <TableCell><Badge variant={tone[v.status]}>{v.status}</Badge></TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{v.date}</TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem><Eye className="size-4" />عرض</DropdownMenuItem>
                          <DropdownMenuItem><CheckCircle2 className="size-4" />موافقة</DropdownMenuItem>
                          <DropdownMenuItem><XCircle className="size-4" />رفض</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive"><Ban className="size-4" />إيقاف</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
