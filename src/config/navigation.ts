import { routes } from "./routes";
import type { Permission } from "./permissions";

export interface NavItem {
  label: string;
  href: string;
  permission?: Permission;
  children?: NavItem[];
}

export const publicNavigation: NavItem[] = [
  { label: "Home", href: routes.public.home },
  { label: "Properties", href: routes.public.properties },
  { label: "Blog", href: routes.public.blog },
  { label: "Contact", href: routes.public.contact },
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", href: routes.admin.dashboard },
  {
    label: "Properties",
    href: routes.admin.properties,
    permission: "properties:read",
  },
  {
    label: "Blog",
    href: routes.admin.blog,
    permission: "blog:read",
  },
  {
    label: "Media",
    href: routes.admin.media,
    permission: "media:read",
  },
  {
    label: "Favorites",
    href: routes.admin.favorites,
    permission: "favorites:read",
  },
  {
    label: "Contact",
    href: routes.admin.contact,
    permission: "contact:read",
  },
  {
    label: "Users",
    href: routes.admin.users,
    permission: "users:read",
  },
  {
    label: "Settings",
    href: routes.admin.settings,
    permission: "settings:read",
  },
  {
    label: "Activity Logs",
    href: routes.admin.logs,
    permission: "logs:read",
  },
];
