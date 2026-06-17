"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "@/config/routes";
import type { AdminNavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

import { adminNavIcons } from "./admin-nav-icons";

interface AdminNavListProps {
  items: AdminNavItem[];
  onNavigate?: () => void;
  className?: string;
}

export function AdminNavList({
  items,
  onNavigate,
  className,
}: AdminNavListProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)}>
      {items.map((item) => {
        const Icon = adminNavIcons[item.icon];
        const isActive =
          pathname === item.href ||
          (item.href !== routes.admin.dashboard &&
            pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 opacity-80" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
