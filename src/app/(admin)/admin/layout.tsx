import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/layout";
import { appConfig } from "@/config/app";
import { enforceAdminAccess } from "@/lib/authorization/guards";
import { filterAdminNavigation } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Admin",
  description: `${appConfig.name} administration workspace`,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await enforceAdminAccess();
  const navigationItems = filterAdminNavigation(user.permissions);

  return <AdminShell navigationItems={navigationItems}>{children}</AdminShell>;
}
