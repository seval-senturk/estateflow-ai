import { PrismaClient } from "@prisma/client";

import { seedBlogData, seedBlogPosts } from "./seed/blog.seed";
import { seedCrmData } from "./seed/crm.seed";
import { seedPropertyData } from "./seed/property.seed";
import { seedDevUsers } from "./seed/users.seed";
import { seedRolesAndPermissions } from "./seed/roles.seed";
import { seedMediaFolders, seedSettings } from "./seed/settings.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("\n🌱 EstateFlow AI — Database Seed\n");

  await seedRolesAndPermissions(prisma);
  await seedPropertyData(prisma);
  await seedBlogData(prisma);
  await seedCrmData(prisma);
  await seedMediaFolders(prisma);
  await seedSettings(prisma);
  await seedDevUsers(prisma);
  await seedBlogPosts(prisma);

  console.log("\n✅ Seed completed successfully.\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
