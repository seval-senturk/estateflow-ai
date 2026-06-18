import { redirect } from "next/navigation";

import { trackSecurityEvent } from "@/lib/logging";
import { auth } from "@/lib/auth";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/lib/errors";
import { routes } from "@/config/routes";
import type { Permission } from "@/config/permissions";
import type { Role } from "@/config/roles";

import {
  authorize,
  authorizeAdminPanel,
  type AccessRequirements,
} from "../authorization";
import type { AuthenticatedUser } from "@/features/auth/types";

export async function getServerSessionUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image ?? null,
    role: session.user.role,
    permissions: session.user.permissions ?? [],
  };
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getServerSessionUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
}

export async function requireAdminAccess(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  authorizeAdminPanel(user);
  return user;
}

export async function requireRole(
  allowedRoles: readonly Role[],
): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  authorize(user, { roles: allowedRoles });
  return user;
}

export async function requirePermission(
  permission: Permission,
): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  authorize(user, { permissions: [permission] });
  return user;
}

export async function requireAccess(
  requirements: AccessRequirements,
): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  authorize(user, requirements);
  return user;
}

export async function enforceAdminAccess(): Promise<AuthenticatedUser> {
  const user = await getServerSessionUser();

  if (!user) {
    redirect(routes.auth.login);
  }

  try {
    authorizeAdminPanel(user);
  } catch {
    redirect(`${routes.public.home}?error=forbidden`);
  }

  return user;
}

export async function enforcePermission(
  permission: Permission,
): Promise<AuthenticatedUser> {
  const user = await enforceAdminAccess();

  try {
    authorize(user, { permissions: [permission] });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      await trackSecurityEvent({
        type: "PERMISSION_VIOLATION",
        userId: user.id,
        metadata: { permission },
      });
      redirect(`${routes.admin.dashboard}?error=forbidden`);
    }
    throw error;
  }

  return user;
}
