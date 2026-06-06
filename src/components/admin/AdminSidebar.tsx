import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Store, FolderTree, Package,
  ShieldCheck, Activity, Sparkles, BarChart3, Settings,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "نظرة عامة",
    items: [{ title: "لوحة التحكم", url: "/admin", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "الأشخاص",
    items: [
      { title: "المستخدمون", url: "/admin/users", icon: Users },
      { title: "البائعون", url: "/admin/vendors", icon: Store },
    ],
  },
  {
    label: "الكتالوج",
    items: [
      { title: "الفئات", url: "/admin/categories", icon: FolderTree },
      { title: "المنتجات", url: "/admin/products", icon: Package },
      { title: "مركز الموافقات", url: "/admin/approvals", icon: ShieldCheck },
    ],
  },
  {
    label: "الذكاء الاصطناعي",
    items: [
      { title: "مراقبة AI", url: "/admin/ai", icon: Activity },
      { title: "التصاميم المُولّدة", url: "/admin/designs", icon: Sparkles },
      { title: "التحليلات", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "النظام",
    items: [{ title: "الإعدادات", url: "/admin/settings", icon: Settings }],
  },
];

type Item = { title: string; url: string; icon: typeof Users; exact?: boolean };

export function AdminSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="border-b border-border/60">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="size-9 rounded-xl bg-gradient-wood grid place-items-center shadow-soft">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm">داري للإدارة</span>
            <span className="text-[10px] text-muted-foreground">Admin Console</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(g.items as Item[]).map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-border/60">
        <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="size-8 rounded-full bg-gradient-gold grid place-items-center text-xs font-bold text-gold-foreground">A</div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-semibold">المدير العام</span>
            <span className="text-[10px] text-muted-foreground">admin@dari.ai</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
