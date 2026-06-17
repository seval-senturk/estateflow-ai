import type { AdminNavItem } from "@/config/navigation";

import { AdminFooter } from "./admin-footer";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

interface AdminShellProps {
  children: React.ReactNode;
  navigationItems: AdminNavItem[];
}

export function AdminShell({ children, navigationItems }: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar items={navigationItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader navigationItems={navigationItems} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
