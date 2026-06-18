import { headers } from "next/headers";

export async function getClientRateLimitKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");

  if (forwarded) {
    const clientIp = forwarded.split(",")[0]?.trim();
    if (clientIp) return `ip:${clientIp}`;
  }

  const realIp = headerList.get("x-real-ip");
  if (realIp) return `ip:${realIp}`;

  return "ip:unknown";
}
