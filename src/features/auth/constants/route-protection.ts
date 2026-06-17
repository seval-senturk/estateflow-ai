import { routes } from "@/config/routes";
import { roles, type Role } from "@/config/roles";
import type { Permission } from "@/config/permissions";

export const ADMIN_PANEL_ROLES: readonly Role[] = [
  roles.SUPER_ADMIN,
  roles.ADMIN,
  roles.EDITOR,
  roles.AGENT,
] as const;

export interface ProtectedAdminRoute {
  prefix: string;
  permission?: Permission;
}

export const PROTECTED_ADMIN_ROUTES: readonly ProtectedAdminRoute[] = [
  { prefix: routes.admin.users, permission: "users:read" },
  { prefix: routes.admin.settings, permission: "settings:read" },
  { prefix: routes.admin.logs, permission: "logs:read" },
  { prefix: routes.admin.media, permission: "media:read" },
  { prefix: routes.admin.properties, permission: "properties:read" },
  { prefix: routes.admin.blog, permission: "blog:read" },
  { prefix: routes.admin.contact, permission: "contact:read" },
  { prefix: routes.admin.favorites, permission: "favorites:read" },
] as const;

export function resolveAdminRoutePermission(
  pathname: string,
): Permission | undefined {
  const match = PROTECTED_ADMIN_ROUTES.find(
    (route) =>
      pathname === route.prefix || pathname.startsWith(`${route.prefix}/`),
  );

  return match?.permission;
}
