"use client";

import Link from "next/link";

import { appConfig } from "@/config/app";
import { routes } from "@/config/routes";
import type { AdminNavItem } from "@/config/navigation";

import { AdminNavList } from "./admin-nav-list";

interface AdminSidebarProps {
  items: AdminNavItem[];
}

export function AdminSidebar({ items }: AdminSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href={routes.admin.dashboard} className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            EF
          </span>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">
              {appConfig.name}
            </p>
            <p className="text-xs text-muted-foreground">Operations</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AdminNavList items={items} />
      </div>
    </aside>
  );
}
