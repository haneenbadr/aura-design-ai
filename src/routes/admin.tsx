import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة — داري" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-6 space-y-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
