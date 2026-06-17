"use client";

import { usePathname } from "next/navigation";

import { getAdminPageMeta } from "@/config/navigation";
import type { AdminNavItem } from "@/config/navigation";
import { Breadcrumb } from "@/components/shared";
import { AdminUserMenu } from "@/components/layouts/admin-user-menu";

import { AdminMobileNav } from "./admin-mobile-nav";

interface AdminHeaderProps {
  navigationItems: AdminNavItem[];
}

export function AdminHeader({ navigationItems }: AdminHeaderProps) {
  const pathname = usePathname();
  const { title, description, breadcrumbs } = getAdminPageMeta(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <AdminMobileNav items={navigationItems} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{title}</p>
            {description ? (
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <AdminUserMenu />
      </div>

      {breadcrumbs.length > 0 ? (
        <div className="hidden border-t border-border/60 px-4 py-2 sm:block sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbs} />
        </div>
      ) : null}
    </header>
  );
}
