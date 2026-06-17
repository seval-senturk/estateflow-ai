import { roles, type Role } from "@/config/roles";
import {
  hasPermission as hasRolePermission,
  type Permission,
} from "@/config/permissions";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/lib/errors";

import { ADMIN_PANEL_ROLES } from "@/features/auth/constants";
import type { AuthenticatedUser } from "@/features/auth/types";

export interface AccessRequirements {
  roles?: readonly Role[];
  permissions?: readonly Permission[];
  requireAll?: boolean;
}

export function hasRole(
  userRole: Role,
  allowedRoles: readonly Role[],
): boolean {
  return allowedRoles.includes(userRole);
}

export function hasPermission(
  userPermissions: readonly Permission[],
  permission: Permission,
): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(
  userPermissions: readonly Permission[],
  requiredPermissions: readonly Permission[],
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(userPermissions, permission),
  );
}

export function hasAllPermissions(
  userPermissions: readonly Permission[],
  requiredPermissions: readonly Permission[],
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(userPermissions, permission),
  );
}

export function canAccessAdminPanel(user: Pick<AuthenticatedUser, "role">): boolean {
  return hasRole(user.role, ADMIN_PANEL_ROLES);
}

export function canAccess(
  user: AuthenticatedUser | null | undefined,
  requirements: AccessRequirements,
): boolean {
  if (!user) return false;

  const roleChecks = requirements.roles?.length
    ? hasRole(user.role, requirements.roles)
    : true;

  const permissionChecks = requirements.permissions?.length
    ? requirements.requireAll
      ? hasAllPermissions(user.permissions, requirements.permissions)
      : hasAnyPermission(user.permissions, requirements.permissions)
    : true;

  if (requirements.roles?.length && requirements.permissions?.length) {
    return requirements.requireAll
      ? roleChecks && permissionChecks
      : roleChecks || permissionChecks;
  }

  return roleChecks && permissionChecks;
}

export function canAccessByRole(role: Role, permission: Permission): boolean {
  return hasRolePermission(role, permission);
}

export function authorize(
  user: AuthenticatedUser | null | undefined,
  requirements: AccessRequirements = {},
): asserts user is AuthenticatedUser {
  if (!user) {
    throw new AuthenticationError();
  }

  if (!canAccess(user, requirements)) {
    throw new AuthorizationError();
  }
}

export function authorizeAdminPanel(
  user: AuthenticatedUser | null | undefined,
): asserts user is AuthenticatedUser {
  if (!user) {
    throw new AuthenticationError();
  }

  if (!canAccessAdminPanel(user)) {
    throw new AuthorizationError(
      "You do not have permission to access the admin workspace",
    );
  }
}

export { roles };
