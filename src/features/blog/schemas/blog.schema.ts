import { BlogPostStatus } from "@prisma/client";
import { z } from "zod";

import { slugify } from "@/utils/formatters/string";

export const blogPostFormSchema = z.object({
  title: z.string().trim().min(3, "Başlık en az 3 karakter olmalıdır").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(1, "İçerik zorunludur"),
  coverImage: z.string().url("Geçerli bir görsel URL'si girin").optional().or(z.literal("")),
  categoryId: z.string().optional(),
  authorId: z.string().min(1, "Yazar seçimi zorunludur"),
  status: z.nativeEnum(BlogPostStatus),
  isFeatured: z.boolean(),
  publishedAt: z.string().optional(),
  tagIds: z.array(z.string()),
  metaTitle: z.string().trim().max(160).optional(),
  metaDescription: z.string().trim().max(320).optional(),
  metaKeywords: z.string().trim().max(255).optional(),
  canonicalUrl: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  ogImage: z.string().url("Geçerli bir görsel URL'si girin").optional().or(z.literal("")),
});

export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;

export const blogListFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "publishedAt", "title", "viewCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type BlogListFiltersInput = z.infer<typeof blogListFiltersSchema>;

export const blogCategoryFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean(),
  metaTitle: z.string().trim().max(160).optional(),
  metaDescription: z.string().trim().max(320).optional(),
  metaKeywords: z.string().trim().max(255).optional(),
});

export type BlogCategoryFormInput = z.infer<typeof blogCategoryFormSchema>;

export const blogTagFormSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export type BlogTagFormInput = z.infer<typeof blogTagFormSchema>;

export const blogSlugFromTitle = (title: string) => slugify(title);
