import type { BlogPostStatus } from "@prisma/client";

export const BLOG_ERROR_CODES = {
  SLUG_CONFLICT: "BLOG_SLUG_CONFLICT",
  NOT_FOUND: "BLOG_NOT_FOUND",
} as const;

export const BLOG_POST_STATUS_LABELS: Record<BlogPostStatus, string> = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşiv",
};

export const BLOG_DETAIL_TABS = [
  { id: "overview", label: "Genel Bakış" },
  { id: "content", label: "İçerik" },
  { id: "seo", label: "SEO" },
  { id: "analytics", label: "Analitik" },
] as const;

export const BLOG_LIST_PAGE_SIZE = 10;
export const PUBLIC_BLOG_PAGE_SIZE = 12;
