import { routes } from "./routes";
import type { Permission } from "./permissions";

export type AdminNavIcon =
  | "layout-dashboard"
  | "building-2"
  | "images"
  | "users-round"
  | "file-text"
  | "user-cog"
  | "settings"
  | "activity";

export interface NavItem {
  label: string;
  href: string;
  permission?: Permission;
  children?: NavItem[];
}

export interface AdminNavItem extends NavItem {
  icon: AdminNavIcon;
  description?: string;
}

export const publicNavigation: NavItem[] = [
  { label: "Home", href: routes.public.home },
  { label: "Properties", href: routes.public.properties },
  { label: "Blog", href: routes.public.blog },
  { label: "Contact", href: routes.public.contact },
];

export const adminNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: routes.admin.dashboard,
    icon: "layout-dashboard",
    description: "Workspace overview and operational metrics",
  },
  {
    label: "Properties",
    href: routes.admin.properties,
    icon: "building-2",
    permission: "properties:read",
    description: "Listing inventory and publication status",
  },
  {
    label: "Media Library",
    href: routes.admin.media,
    icon: "images",
    permission: "media:read",
    description: "Uploaded assets and media organization",
  },
  {
    label: "Leads",
    href: routes.admin.leads,
    icon: "users-round",
    permission: "leads:read",
    description: "Inbound inquiries and pipeline activity",
  },
  {
    label: "Blog",
    href: routes.admin.blog,
    icon: "file-text",
    permission: "blog:read",
    description: "Editorial content and publishing workflow",
  },
  {
    label: "Users",
    href: routes.admin.users,
    icon: "user-cog",
    permission: "users:read",
    description: "Team accounts and access management",
  },
  {
    label: "Settings",
    href: routes.admin.settings,
    icon: "settings",
    permission: "settings:read",
    description: "Company profile and platform configuration",
  },
  {
    label: "Activity Logs",
    href: routes.admin.logs,
    icon: "activity",
    permission: "logs:read",
    description: "Audit trail and system activity history",
  },
];

export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
  return adminNavigation.find((item) => {
    if (item.href === routes.admin.dashboard) {
      return pathname === item.href;
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
}

export function getAdminPageMeta(pathname: string) {
  const navItem = findAdminNavItem(pathname);

  return {
    title: navItem?.label ?? "Administration",
    description: navItem?.description,
    breadcrumbs: navItem
      ? [{ label: "Admin", href: routes.admin.dashboard }, { label: navItem.label }]
      : [{ label: "Admin", href: routes.admin.dashboard }],
  };
}
