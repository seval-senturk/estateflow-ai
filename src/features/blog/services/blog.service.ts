import type { BlogPostStatus } from "@prisma/client";

import { loggableEntities, snapshotRecord, trackActivity, trackAudit } from "@/lib/logging";
import { ValidationError } from "@/lib/errors";
import { BaseService } from "@/services/base.service";
import type { AsyncActionResult } from "@/types";

import { BLOG_ERROR_CODES } from "../constants";
import { blogRepository } from "../repositories";
import {
  blogCategoryFormSchema,
  blogListFiltersSchema,
  blogPostFormSchema,
  blogTagFormSchema,
} from "../schemas";
import type {
  BlogCategoryFormInput,
  BlogListFiltersInput,
  BlogPostFormInput,
  BlogTagFormInput,
} from "../schemas";
import type {
  BlogCategoryListItem,
  BlogLookupData,
  BlogPostDetail,
  BlogPostListResult,
  BlogTagListItem,
  PublicBlogFilters,
} from "../types";

export class BlogService extends BaseService {
  async list(filters: BlogListFiltersInput): AsyncActionResult<BlogPostListResult> {
    try {
      const parsed = blogListFiltersSchema.safeParse(filters);
      if (!parsed.success) {
        throw new ValidationError("Invalid blog list filters");
      }

      const status =
        parsed.data.status && parsed.data.status !== "all"
          ? (parsed.data.status as BlogPostStatus)
          : undefined;

      const result = await blogRepository.findMany({
        ...parsed.data,
        status,
      });

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): AsyncActionResult<BlogPostDetail> {
    try {
      const post = await blogRepository.findById(id);
      this.assertFound(post, "Blog post");
      return this.success(post);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLookupData(): Promise<BlogLookupData> {
    return blogRepository.getLookupData();
  }

  async create(input: BlogPostFormInput, userId: string): AsyncActionResult<{ id: string }> {
    try {
      const parsed = blogPostFormSchema.parse(input);

      if (await blogRepository.slugExists(parsed.slug)) {
        return this.fail("Bu slug zaten kullanılıyor", BLOG_ERROR_CODES.SLUG_CONFLICT);
      }

      const post = await blogRepository.create(parsed, userId);
      await trackActivity({
        userId,
        action: "CREATE",
        entityType: loggableEntities.BLOG_POST,
        entityId: post.id,
        description: `Blog yazısı oluşturuldu: ${parsed.title}`,
      });
      await trackAudit({
        userId,
        action: "CREATE",
        entityType: loggableEntities.BLOG_POST,
        entityId: post.id,
        newValues: snapshotRecord(parsed as unknown as Record<string, unknown>, ["title", "slug", "status"]),
      });
      return this.success({ id: post.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(
    id: string,
    input: BlogPostFormInput,
    userId: string,
  ): AsyncActionResult<{ id: string }> {
    try {
      const parsed = blogPostFormSchema.parse(input);

      if (await blogRepository.slugExists(parsed.slug, id)) {
        return this.fail("Bu slug zaten kullanılıyor", BLOG_ERROR_CODES.SLUG_CONFLICT);
      }

      const existing = await blogRepository.findById(id);
      this.assertFound(existing, "Blog post");

      const post = await blogRepository.update(id, parsed, userId);
      await trackActivity({
        userId,
        action: "UPDATE",
        entityType: loggableEntities.BLOG_POST,
        entityId: id,
        description: `Blog yazısı güncellendi: ${parsed.title}`,
      });
      await trackAudit({
        userId,
        action: "UPDATE",
        entityType: loggableEntities.BLOG_POST,
        entityId: id,
        oldValues: snapshotRecord(existing as unknown as Record<string, unknown>, ["title", "slug", "status"]),
        newValues: snapshotRecord(parsed as unknown as Record<string, unknown>, ["title", "slug", "status"]),
      });
      return this.success({ id: post.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateStatus(
    id: string,
    status: BlogPostStatus,
    userId: string,
  ): AsyncActionResult<{ id: string }> {
    try {
      const post = await blogRepository.updateStatus(id, status, userId);
      const action = status === "PUBLISHED" ? "PUBLISH" : status === "DRAFT" ? "UNPUBLISH" : "UPDATE";
      await trackActivity({
        userId,
        action,
        entityType: loggableEntities.BLOG_POST,
        entityId: id,
        description: `Blog durumu güncellendi: ${post.title}`,
        metadata: { status },
      });
      return this.success({ id: post.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string, userId: string): AsyncActionResult<void> {
    try {
      const existing = await blogRepository.findById(id);
      this.assertFound(existing, "Blog post");
      await blogRepository.softDelete(id, userId);
      await trackActivity({
        userId,
        action: "DELETE",
        entityType: loggableEntities.BLOG_POST,
        entityId: id,
        description: `Blog yazısı silindi: ${existing.title}`,
      });
      await trackAudit({
        userId,
        action: "DELETE",
        entityType: loggableEntities.BLOG_POST,
        entityId: id,
        oldValues: snapshotRecord(existing as unknown as Record<string, unknown>, ["title", "slug"]),
      });
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listPublished(filters: PublicBlogFilters = {}) {
    return blogRepository.findPublicMany(filters);
  }

  async getPublishedBySlug(slug: string) {
    return blogRepository.findPublishedBySlug(slug);
  }

  async getRelatedPosts(postId: string, categoryId: string | null) {
    return blogRepository.findRelatedPosts(postId, categoryId);
  }

  async recordView(postId: string) {
    await blogRepository.incrementViewCount(postId);
  }

  async listCategories(): Promise<BlogCategoryListItem[]> {
    return blogRepository.listCategories();
  }

  async createCategory(input: BlogCategoryFormInput) {
    const parsed = blogCategoryFormSchema.parse(input);
    if (await blogRepository.categorySlugExists(parsed.slug)) {
      return this.fail("Bu kategori slug'ı zaten kullanılıyor", BLOG_ERROR_CODES.SLUG_CONFLICT);
    }
    const category = await blogRepository.createCategory(parsed);
    return this.success({ id: category.id });
  }

  async updateCategory(id: string, input: BlogCategoryFormInput) {
    const parsed = blogCategoryFormSchema.parse(input);
    if (await blogRepository.categorySlugExists(parsed.slug, id)) {
      return this.fail("Bu kategori slug'ı zaten kullanılıyor", BLOG_ERROR_CODES.SLUG_CONFLICT);
    }
    await blogRepository.updateCategory(id, parsed);
    return this.success({ id });
  }

  async deleteCategory(id: string) {
    await blogRepository.softDeleteCategory(id);
    return this.success(undefined);
  }

  async listTags(): Promise<BlogTagListItem[]> {
    return blogRepository.listTags();
  }

  async createTag(input: BlogTagFormInput) {
    const parsed = blogTagFormSchema.parse(input);
    if (await blogRepository.tagSlugExists(parsed.slug)) {
      return this.fail("Bu etiket slug'ı zaten kullanılıyor", BLOG_ERROR_CODES.SLUG_CONFLICT);
    }
    const tag = await blogRepository.createTag(parsed);
    return this.success({ id: tag.id });
  }

  async updateTag(id: string, input: BlogTagFormInput) {
    const parsed = blogTagFormSchema.parse(input);
    if (await blogRepository.tagSlugExists(parsed.slug, id)) {
      return this.fail("Bu etiket slug'ı zaten kullanılıyor", BLOG_ERROR_CODES.SLUG_CONFLICT);
    }
    await blogRepository.updateTag(id, parsed);
    return this.success({ id });
  }

  async deleteTag(id: string) {
    await blogRepository.softDeleteTag(id);
    return this.success(undefined);
  }

  async getCategoryBySlug(slug: string) {
    return blogRepository.findCategoryBySlug(slug);
  }

  async getTagBySlug(slug: string) {
    return blogRepository.findTagBySlug(slug);
  }
}

export const blogService = new BlogService();
