import type { PrismaClient } from "@prisma/client";

import { BLOG_CATEGORIES } from "./data";
import { upsertActiveBySlug } from "./utils";

export async function seedBlogData(prisma: PrismaClient) {
  console.log("  → Seeding blog categories...");

  for (const category of BLOG_CATEGORIES) {
    await upsertActiveBySlug(prisma, "blogCategory", category.slug, category);
  }

  console.log(`    ✓ ${BLOG_CATEGORIES.length} blog categories`);
}
