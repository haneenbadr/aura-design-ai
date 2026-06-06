import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Filter, Download, MoreHorizontal, Eye, Pencil, Ban } from "lucide-react";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

const users = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: ["سارة الأحمدي", "محمد العلي", "نورة السبيعي", "خالد الزهراني", "ليلى الحربي",
         "أحمد الغامدي", "فاطمة المطيري", "عبدالله القحطاني", "هند الدوسري", "ياسر الشهري"][i],
  email: `user${i + 1}@dari.ai`,
  status: ["نشط", "نشط", "موقوف", "نشط", "نشط", "نشط", "موقوف", "نشط", "نشط", "نشط"][i],
  date: `2025-0${(i % 9) + 1}-12`,
  designs: [12, 4, 28, 7, 19, 33, 2, 41, 15, 9][i],
}));

function UsersPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="إدارة المستخدمين" description="12,480 مستخدم مسجل في المنصة"
        actions={<><Button variant="outline" size="sm"><Download className="size-4" />تصدير</Button></>} />

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="بحث عن مستخدم بالاسم أو البريد..." className="pr-9" />
            </div>
            <Button variant="outline" size="sm"><Filter className="size-4" />الفلاتر</Button>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>البريد</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الانضمام</TableHead>
                  <TableHead>التصاميم</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8"><AvatarFallback className="text-xs bg-secondary">{u.name[0]}</AvatarFallback></Avatar>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "نشط" ? "secondary" : "destructive"}>{u.status}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{u.date}</TableCell>
                    <TableCell className="tabular-nums font-medium">{u.designs}</TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem><Eye className="size-4" />عرض</DropdownMenuItem>
                          <DropdownMenuItem><Pencil className="size-4" />تعديل</DropdownMenuItem>
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
