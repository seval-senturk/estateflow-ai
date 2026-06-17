import type { Permission } from "@/config/permissions";
import {
  adminNavigation,
  type AdminNavItem,
} from "@/config/navigation";
import { hasPermission } from "@/lib/authorization";

export function filterAdminNavigation(
  userPermissions: readonly Permission[],
): AdminNavItem[] {
  return adminNavigation.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(userPermissions, item.permission);
  });
}
