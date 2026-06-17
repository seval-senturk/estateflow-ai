"use client";

import { useSession } from "next-auth/react";

import type { Permission } from "@/config/permissions";
import type { Role } from "@/config/roles";
import {
  canAccess,
  canAccessAdminPanel,
  hasPermission,
  hasRole,
  type AccessRequirements,
} from "@/lib/authorization";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image ?? null,
        role: session.user.role,
        permissions: session.user.permissions ?? [],
      }
    : null;

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    canAccessAdmin: user ? canAccessAdminPanel(user) : false,
  };
}

export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return hasPermission(user.permissions, permission);
}

export function useRole(allowedRoles: readonly Role[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return hasRole(user.role, allowedRoles);
}

export function useAccess(requirements: AccessRequirements): boolean {
  const { user } = useAuth();
  return canAccess(user, requirements);
}
