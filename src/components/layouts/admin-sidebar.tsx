"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appConfig } from "@/config/app";
import { adminNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@/features/auth/hooks";
import { hasPermission } from "@/lib/authorization";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleNavigation = adminNavigation.filter((item) => {
    if (!item.permission) return true;
    if (!user) return false;
    return hasPermission(user.permissions, item.permission);
  });

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href={routes.admin.dashboard} className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            EF
          </span>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">
              {appConfig.name}
            </p>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {visibleNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== routes.admin.dashboard &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
