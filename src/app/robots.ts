import type { MetadataRoute } from "next";

import { seoConfig } from "@/config/seo";
import { prisma } from "@/lib/database";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await prisma.seoSettings.findFirst({
    select: { robotsTxt: true },
  });

  const customRules = settings?.robotsTxt?.trim();

  if (customRules) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/"],
      },
      sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
      host: seoConfig.siteUrl,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
    host: seoConfig.siteUrl,
  };
}
