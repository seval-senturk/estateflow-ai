import type { PrismaClient } from "@prisma/client";

import { PROPERTY_CATEGORIES, PROPERTY_FEATURES, PROPERTY_STATUSES } from "./data";
import { upsertActiveBySlug } from "./utils";

export async function seedPropertyData(prisma: PrismaClient) {
  console.log("  → Seeding property statuses, categories, and features...");

  for (const status of PROPERTY_STATUSES) {
    await upsertActiveBySlug(prisma, "propertyStatus", status.slug, status);
  }

  for (const category of PROPERTY_CATEGORIES) {
    await upsertActiveBySlug(prisma, "propertyCategory", category.slug, category);
  }

  for (const feature of PROPERTY_FEATURES) {
    await upsertActiveBySlug(prisma, "propertyFeature", feature.slug, feature);
  }

  console.log(
    `    ✓ ${PROPERTY_STATUSES.length} statuses, ${PROPERTY_CATEGORIES.length} categories, ${PROPERTY_FEATURES.length} features`,
  );
}
