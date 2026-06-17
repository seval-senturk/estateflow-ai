import type { BlogPostStatus } from "@prisma/client";

import type { BlogLookupData, BlogPostDetail } from "../types";
import type { BlogPostFormInput } from "../schemas";

export function buildBlogFormDefaults(
  lookup: BlogLookupData,
  post?: BlogPostDetail,
  currentUserId?: string,
): BlogPostFormInput {
  if (post) {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      categoryId: post.categoryId ?? "",
      authorId: post.authorId,
      status: post.status,
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt?.toISOString().slice(0, 16) ?? "",
      tagIds: post.tags.map((tag) => tag.id),
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
      metaKeywords: post.metaKeywords ?? "",
      canonicalUrl: post.canonicalUrl ?? "",
      ogImage: post.ogImage ?? "",
    };
  }

  const defaultAuthor =
    lookup.authors.find((author) => author.id === currentUserId) ?? lookup.authors[0];

  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    categoryId: "",
    authorId: defaultAuthor?.id ?? "",
    status: "DRAFT" as BlogPostStatus,
    isFeatured: false,
    publishedAt: "",
    tagIds: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    ogImage: "",
  };
}
