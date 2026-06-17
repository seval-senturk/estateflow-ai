import type { BlogPostStatus } from "@prisma/client";

export interface BlogTagRef {
  id: string;
  name: string;
  slug: string;
}

export interface BlogCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface BlogAuthorRef {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: BlogPostStatus;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
  viewCount: number;
  categoryName: string | null;
  authorName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostListResult {
  items: BlogPostListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BlogPostListFilters {
  search?: string;
  status?: BlogPostStatus | "all";
  categoryId?: string;
  authorId?: string;
  isFeatured?: boolean;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "publishedAt" | "title" | "viewCount";
  sortOrder?: "asc" | "desc";
}

export interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  categoryId: string | null;
  category: BlogCategoryRef | null;
  authorId: string;
  author: BlogAuthorRef;
  status: BlogPostStatus;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
  viewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  tags: BlogTagRef[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicBlogFilters {
  search?: string;
  categorySlug?: string;
  tagSlug?: string;
  page?: number;
  pageSize?: number;
}

export interface PublicBlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  viewCount: number;
  isFeatured: boolean;
  category: BlogCategoryRef | null;
  author: BlogAuthorRef;
  tags: BlogTagRef[];
}

export interface PublicBlogPost extends PublicBlogListItem {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
}

export interface BlogCategoryListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  postCount: number;
}

export interface BlogTagListItem {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogLookupData {
  categories: BlogCategoryRef[];
  tags: BlogTagRef[];
  authors: BlogAuthorRef[];
}
