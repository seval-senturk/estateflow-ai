import type { Metadata } from "next";

import { AdminHeader, AdminSidebar } from "@/components/layouts";
import { appConfig } from "@/config/app";
import { enforceAdminAccess } from "@/lib/authorization/guards";

export const metadata: Metadata = {
  title: "Admin",
  description: `${appConfig.name} administration workspace`,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceAdminAccess();

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
