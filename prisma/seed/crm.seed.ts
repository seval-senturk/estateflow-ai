import type { PrismaClient } from "@prisma/client";

import { LEAD_STATUSES } from "./data";
import { upsertActiveBySlug } from "./utils";

export async function seedCrmData(prisma: PrismaClient) {
  console.log("  → Seeding CRM lead statuses...");

  for (const status of LEAD_STATUSES) {
    await upsertActiveBySlug(prisma, "leadStatus", status.slug, status);
  }

  console.log(`    ✓ ${LEAD_STATUSES.length} lead statuses`);
}
