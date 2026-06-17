import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { seoConfig } from "@/config/seo";
import { blogRepository } from "@/features/blog/repositories";
import { propertyRepository } from "@/features/properties/repositories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl;

  const [blogPosts, blogCategories, publishedProperties] = await Promise.all([
    blogRepository.listPublishedSlugs(),
    blogRepository.listActiveCategorySlugs(),
    propertyRepository.listPublishedSlugs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}${routes.public.home}`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}${routes.public.properties}`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${routes.public.blog}`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${routes.public.about}`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}${routes.public.contact}`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const propertyPages: MetadataRoute.Sitemap = publishedProperties.map((property) => ({
    url: `${baseUrl}${routes.public.propertyDetail(property.slug)}`,
    lastModified: property.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}${routes.public.blogPost(post.slug)}`,
    lastModified: post.publishedAt ?? post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = blogCategories.map((category) => ({
    url: `${baseUrl}${routes.public.blogCategory(category.slug)}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages, ...blogPostPages, ...categoryPages];
}
