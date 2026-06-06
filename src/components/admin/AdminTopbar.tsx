import { Bell, Search, Activity } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-40 h-14 glass border-b border-border/60 flex items-center gap-3 px-4">
      <SidebarTrigger className="shrink-0" />
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="بحث عالمي عن مستخدم، بائع، منتج..." className="pr-9 bg-background/60" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="مركز النشاط">
          <Activity className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="الإشعارات">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              "بائع جديد بانتظار الموافقة",
              "3 منتجات جديدة بحاجة للمراجعة",
              "تنبيه: زمن استجابة AI مرتفع",
            ].map((n, i) => (
              <DropdownMenuItem key={i} className="flex flex-col items-start gap-1">
                <span className="text-sm">{n}</span>
                <span className="text-[10px] text-muted-foreground">منذ {i + 2} دقائق</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="size-7"><AvatarFallback className="bg-gradient-wood text-primary-foreground text-xs">A</AvatarFallback></Avatar>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-xs font-semibold">المدير العام</span>
                <Badge variant="secondary" className="h-4 text-[9px] px-1">Admin</Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
            <DropdownMenuItem>الإعدادات</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
