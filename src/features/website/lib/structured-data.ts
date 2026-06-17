import { routes } from "@/config/routes";
import { seoConfig } from "@/config/seo";
import type { PublicBlogPost } from "@/features/blog/types";
import type { PublicPropertyDetail, PublicPropertyListItem } from "@/features/properties/types";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: seoConfig.defaultTitle,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
  };
}

export function buildPropertyListJsonLd(properties: PublicPropertyListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${seoConfig.siteUrl}${routes.public.propertyDetail(property.slug)}`,
      name: property.title,
    })),
  };
}

export function buildPropertyJsonLd(property: PublicPropertyDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.metaDescription ?? property.shortDescription ?? property.description,
    url: `${seoConfig.siteUrl}${routes.public.propertyDetail(property.slug)}`,
    image: property.ogImage ?? property.primaryImageUrl ?? property.gallery.images[0]?.url,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city ?? undefined,
      addressRegion: property.district ?? undefined,
      streetAddress: property.address ?? undefined,
      addressCountry: "TR",
    },
  };
}

export function buildBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${seoConfig.siteUrl}${item.href}` } : {}),
    })),
  };
}

export function buildBlogListJsonLd(posts: Array<{ title: string; slug: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${seoConfig.siteUrl}${routes.public.blogPost(post.slug)}`,
      name: post.title,
    })),
  };
}

export function buildArticleJsonLd(post: PublicBlogPost) {
  const authorName = post.author.name ?? post.author.email;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    image: post.ogImage ?? post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.publishedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.defaultTitle,
      url: seoConfig.siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${seoConfig.siteUrl}${routes.public.blogPost(post.slug)}`,
    },
    keywords: post.metaKeywords ?? undefined,
    articleSection: post.category?.name,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.defaultTitle,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${seoConfig.siteUrl}${routes.public.properties}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
