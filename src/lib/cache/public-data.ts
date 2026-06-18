import { unstable_cache } from "next/cache";

import { blogRepository } from "@/features/blog/repositories";
import { propertyRepository } from "@/features/properties/repositories";
import type { PublicBlogFilters } from "@/features/blog/types";
import type { PublicPropertyFilters } from "@/features/properties/types";

export const CACHE_TAGS = {
  properties: "properties",
  property: (slug: string) => `property:${slug}`,
  blog: "blog",
  blogPost: (slug: string) => `blog:${slug}`,
} as const;

export const PUBLIC_REVALIDATE_SECONDS = 60;

export function getCachedPublishedProperties(filters: PublicPropertyFilters = {}) {
  const key = JSON.stringify(filters);
  return unstable_cache(
    () => propertyRepository.findPublicMany(filters),
    ["published-properties", key],
    { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [CACHE_TAGS.properties] },
  )();
}

export function getCachedPublishedPropertyBySlug(slug: string) {
  return unstable_cache(
    () => propertyRepository.findBySlug(slug, true),
    ["published-property", slug],
    { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [CACHE_TAGS.properties, CACHE_TAGS.property(slug)] },
  )();
}

export function getCachedPublishedBlogPosts(filters: PublicBlogFilters = {}) {
  const key = JSON.stringify(filters);
  return unstable_cache(
    () => blogRepository.findPublicMany(filters),
    ["published-blog-posts", key],
    { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [CACHE_TAGS.blog] },
  )();
}

export function getCachedPublishedBlogBySlug(slug: string) {
  return unstable_cache(
    () => blogRepository.findPublishedBySlug(slug),
    ["published-blog-post", slug],
    { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [CACHE_TAGS.blog, CACHE_TAGS.blogPost(slug)] },
  )();
}
