import type { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

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

export async function seedSuperAdmin(prisma: PrismaClient) {
  console.log("  → Seeding super admin user...");

  const superAdminRole = await prisma.role.findUnique({
    where: { slug: "SUPER_ADMIN" },
  });

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found. Run roles seed first.");
  }

  const passwordHash = await hash("Admin123!", 12);

  const user = await prisma.user.upsert({
    where: { email: "admin@estateflow.ai" },
    update: {
      name: "Super Admin",
      roleId: superAdminRole.id,
      passwordHash,
      isActive: true,
    },
    create: {
      name: "Super Admin",
      email: "admin@estateflow.ai",
      roleId: superAdminRole.id,
      passwordHash,
      isActive: true,
      profile: {
        create: {
          title: "System Administrator",
          phone: "+90 555 000 0000",
          city: "Istanbul",
          country: "TR",
        },
      },
    },
  });

  console.log(`    ✓ Super admin: ${user.email}`);
}
