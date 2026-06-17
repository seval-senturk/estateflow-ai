import type { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

import { PASSWORD_HASH_ROUNDS } from "@/lib/password";

const DEV_PASSWORD = "Admin123!";

const DEV_USERS = [
  {
    name: "Super Admin",
    email: "admin@estateflow.ai",
    roleSlug: "SUPER_ADMIN",
    title: "System Administrator",
  },
  {
    name: "Platform Admin",
    email: "platform.admin@estateflow.ai",
    roleSlug: "ADMIN",
    title: "Platform Administrator",
  },
  {
    name: "Content Editor",
    email: "editor@estateflow.ai",
    roleSlug: "EDITOR",
    title: "Content Editor",
  },
  {
    name: "Sales Agent",
    email: "agent@estateflow.ai",
    roleSlug: "AGENT",
    title: "Real Estate Agent",
  },
] as const;

export async function seedDevUsers(prisma: PrismaClient) {
  console.log("  → Seeding development users...");

  const passwordHash = await hash(DEV_PASSWORD, PASSWORD_HASH_ROUNDS);

  for (const devUser of DEV_USERS) {
    const role = await prisma.role.findUnique({
      where: { slug: devUser.roleSlug },
    });

    if (!role) {
      throw new Error(`${devUser.roleSlug} role not found. Run roles seed first.`);
    }

    const user = await prisma.user.upsert({
      where: { email: devUser.email },
      update: {
        name: devUser.name,
        roleId: role.id,
        passwordHash,
        isActive: true,
      },
      create: {
        name: devUser.name,
        email: devUser.email,
        roleId: role.id,
        passwordHash,
        isActive: true,
        profile: {
          create: {
            title: devUser.title,
            city: "Istanbul",
            country: "TR",
          },
        },
      },
    });

    console.log(`    ✓ ${devUser.roleSlug}: ${user.email}`);
  }

  console.log(`    ↳ Shared password: ${DEV_PASSWORD}`);
}
