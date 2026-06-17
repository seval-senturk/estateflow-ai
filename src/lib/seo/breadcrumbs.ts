import { routes } from "@/config/routes";
import { seoConfig } from "@/config/seo";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
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

export const homeBreadcrumb = (): BreadcrumbItem[] => [
  { label: "Ana Sayfa", href: routes.public.home },
];

export const propertiesBreadcrumb = (): BreadcrumbItem[] => [
  ...homeBreadcrumb(),
  { label: "İlanlar", href: routes.public.properties },
];

export const propertyDetailBreadcrumb = (title: string, slug: string): BreadcrumbItem[] => [
  ...propertiesBreadcrumb(),
  { label: title, href: routes.public.propertyDetail(slug) },
];

export const blogBreadcrumb = (): BreadcrumbItem[] => [
  ...homeBreadcrumb(),
  { label: "Blog", href: routes.public.blog },
];

export const blogPostBreadcrumb = (title: string, slug: string): BreadcrumbItem[] => [
  ...blogBreadcrumb(),
  { label: title, href: routes.public.blogPost(slug) },
];

export const blogCategoryBreadcrumb = (name: string, slug: string): BreadcrumbItem[] => [
  ...blogBreadcrumb(),
  { label: name, href: routes.public.blogCategory(slug) },
];
