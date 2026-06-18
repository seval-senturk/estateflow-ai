import { headers } from "next/headers";

import type { LogContext } from "@/types/logging";

export async function getLogContext(userId?: string, userEmail?: string): Promise<LogContext> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const ipAddress =
    forwarded?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    undefined;

  return {
    userId,
    userEmail,
    ipAddress,
    userAgent: headersList.get("user-agent") ?? undefined,
  };
}
