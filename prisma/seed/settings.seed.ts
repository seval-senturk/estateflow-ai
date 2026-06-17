import type { PrismaClient } from "@prisma/client";

import { MEDIA_FOLDERS } from "./data";
import { upsertActiveBySlug } from "./utils";

export async function seedMediaFolders(prisma: PrismaClient) {
  console.log("  → Seeding media folders...");

  for (const folder of MEDIA_FOLDERS) {
    await upsertActiveBySlug(prisma, "mediaFolder", folder.slug, folder);
  }

  console.log(`    ✓ ${MEDIA_FOLDERS.length} media folders`);
}

export async function seedSettings(prisma: PrismaClient) {
  console.log("  → Seeding default settings...");

  const existingSite = await prisma.siteSettings.findFirst();
  if (!existingSite) {
    await prisma.siteSettings.create({
      data: {
        siteName: "EstateFlow AI",
        tagline: "Modern Real Estate Management Platform",
        defaultLocale: "tr",
        defaultCurrency: "TRY",
      },
    });
  }

  const existingSeo = await prisma.seoSettings.findFirst();
  if (!existingSeo) {
    await prisma.seoSettings.create({
      data: {
        defaultTitle: "EstateFlow AI",
        defaultDescription:
          "Professional real estate management platform for agents and property teams.",
        titleSeparator: "|",
      },
    });
  }

  const existingCompany = await prisma.companySettings.findFirst();
  if (!existingCompany) {
    await prisma.companySettings.create({
      data: {
        name: "EstateFlow AI",
        email: "info@estateflow.ai",
        phone: "+90 212 000 0000",
        city: "Istanbul",
        country: "TR",
        workingHours: "Pazartesi - Cuma: 09:00 - 18:00",
      },
    });
  }

  const existingEmail = await prisma.emailSettings.findFirst();
  if (!existingEmail) {
    await prisma.emailSettings.create({ data: { isEnabled: false } });
  }

  const existingSocial = await prisma.socialMediaSettings.findFirst();
  if (!existingSocial) {
    await prisma.socialMediaSettings.create({ data: {} });
  }

  console.log("    ✓ Default settings initialized");
}
