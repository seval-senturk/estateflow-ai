import type { Prisma } from "@prisma/client";

import { activeOnly, prisma } from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";

const userWithRolePermissions = {
  role: {
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  },
} satisfies Prisma.UserInclude;

export type UserWithRolePermissions = Prisma.UserGetPayload<{
  include: typeof userWithRolePermissions;
}>;

export class UserRepository extends BaseRepository {
  async findByEmailWithPermissions(
    email: string,
  ): Promise<UserWithRolePermissions | null> {
    return prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        ...activeOnly,
      },
      include: userWithRolePermissions,
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}

export const userRepository = new UserRepository();
