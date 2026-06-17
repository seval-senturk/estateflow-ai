import { LoginResult } from "@prisma/client";

import { prisma } from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";

export class LoginHistoryRepository extends BaseRepository {
  async recordAttempt(params: {
    userId?: string;
    email: string;
    result: LoginResult;
    ipAddress?: string;
    userAgent?: string;
    reason?: string;
  }): Promise<void> {
    await prisma.loginHistory.create({
      data: {
        userId: params.userId,
        email: params.email.toLowerCase(),
        result: params.result,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        reason: params.reason,
      },
    });
  }
}

export const loginHistoryRepository = new LoginHistoryRepository();
