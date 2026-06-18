import { LoginResult } from "@prisma/client";

import { trackActivity, trackSecurityEvent } from "@/lib/logging";
import { roles, type Role } from "@/config/roles";
import type { Permission } from "@/config/permissions";
import { verifyPassword } from "@/lib/password";
import { BaseService } from "@/services/base.service";

import { AccountDisabledError, InvalidCredentialsError } from "../errors";
import { loginHistoryRepository } from "../repositories/login-history.repository";
import {
  userRepository,
  type UserWithRolePermissions,
} from "../repositories/user.repository";
import type { AuthenticatedUser } from "../types";

interface AuthenticateOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService extends BaseService {
  async authenticate(
    email: string,
    password: string,
    options: AuthenticateOptions = {},
  ): Promise<AuthenticatedUser> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmailWithPermissions(normalizedEmail);

    if (!user) {
      await this.recordLoginFailure(normalizedEmail, options, "User not found");
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      await this.recordLoginFailure(
        normalizedEmail,
        options,
        "Account disabled",
        user.id,
      );
      throw new AccountDisabledError();
    }

    if (!user.passwordHash) {
      await this.recordLoginFailure(
        normalizedEmail,
        options,
        "Missing password hash",
        user.id,
      );
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      await this.recordLoginFailure(
        normalizedEmail,
        options,
        "Invalid password",
        user.id,
      );
      throw new InvalidCredentialsError();
    }

    await loginHistoryRepository.recordAttempt({
      userId: user.id,
      email: normalizedEmail,
      result: LoginResult.SUCCESS,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    });

    await trackActivity({
      userId: user.id,
      action: "LOGIN",
      entityType: "SESSION",
      description: `Başarılı giriş: ${normalizedEmail}`,
      context: {
        userId: user.id,
        userEmail: normalizedEmail,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
      },
    });

    await userRepository.updateLastLogin(user.id);

    return this.toAuthenticatedUser(user);
  }

  toAuthenticatedUser(user: UserWithRolePermissions): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: this.toAppRole(user.role.slug),
      permissions: this.extractPermissions(user),
    };
  }

  private extractPermissions(user: UserWithRolePermissions): Permission[] {
    return user.role.rolePermissions.map(
      (entry) => entry.permission.slug as Permission,
    );
  }

  private toAppRole(slug: string): Role {
    const knownRoles = Object.values(roles);
    return knownRoles.includes(slug as Role) ? (slug as Role) : roles.VIEWER;
  }

  private async recordLoginFailure(
    email: string,
    options: AuthenticateOptions,
    reason: string,
    userId?: string,
  ): Promise<void> {
    await loginHistoryRepository.recordAttempt({
      userId,
      email,
      result: LoginResult.FAILURE,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      reason,
    });
    await trackSecurityEvent({
      type: "FAILED_LOGIN",
      userId,
      metadata: { email, reason },
      context: {
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
      },
    });
  }
}

export const authService = new AuthService();
