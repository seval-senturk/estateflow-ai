import type { Metadata } from "next";

import { seoConfig } from "@/config/seo";

export interface PageSeoInput {
  title: string;
  description?: string | null;
  canonicalPath?: string;
  canonicalUrl?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  ogType?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  noIndex?: boolean;
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const canonical =
    input.canonicalUrl ??
    (input.canonicalPath ? `${seoConfig.siteUrl}${input.canonicalPath}` : undefined);

  const ogImages = input.ogImage ? [{ url: input.ogImage }] : undefined;

  return {
    title: input.title,
    description: input.description ?? seoConfig.defaultDescription,
    keywords: input.keywords?.split(",").map((keyword) => keyword.trim()).filter(Boolean),
    alternates: canonical ? { canonical } : undefined,
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description ?? seoConfig.defaultDescription,
      url: canonical,
      type: input.ogType ?? "website",
      siteName: seoConfig.openGraph.siteName,
      locale: seoConfig.openGraph.locale,
      images: ogImages,
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.authors?.length ? { authors: input.authors } : {}),
    },
    twitter: {
      card: seoConfig.twitter.card,
      title: input.title,
      description: input.description ?? seoConfig.defaultDescription,
      images: input.ogImage ? [input.ogImage] : undefined,
    },
  };
}
