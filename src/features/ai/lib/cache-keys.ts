import { createHash } from "crypto";

export function hashAiCacheKey(...parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 24);
}
