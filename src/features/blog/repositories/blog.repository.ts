import type { BlogPostStatus, Prisma } from "@prisma/client";

import {
  activeOnly,
  auditCreateFields,
  auditUpdateFields,
  prisma,
  softDeleteData,
  toPaginatedResult,
  toPrismaPagination,
} from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";

import type {
  BlogCategoryListItem,
  BlogCategoryRef,
  BlogLookupData,
  BlogPostDetail,
  BlogPostListFilters,
  BlogPostListItem,
  BlogPostListResult,
  BlogTagListItem,
  BlogTagRef,
  PublicBlogFilters,
  PublicBlogListItem,
  PublicBlogPost,
} from "../types";
import type { BlogCategoryFormInput, BlogPostFormInput, BlogTagFormInput } from "../schemas";

const postListInclude = {
  category: true,
  author: { select: { id: true, name: true, email: true, image: true } },
} satisfies Prisma.BlogPostInclude;

const postDetailInclude = {
  category: true,
  author: { select: { id: true, name: true, email: true, image: true } },
  tags: { include: { tag: true } },
} satisfies Prisma.BlogPostInclude;

const postPublicListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  viewCount: true,
  isFeatured: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, email: true, image: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
} satisfies Prisma.BlogPostSelect;

type PublicListPostRow = Prisma.BlogPostGetPayload<{ select: typeof postPublicListSelect }>;

function mapAuthor(
  author: Prisma.UserGetPayload<{ select: { id: true; name: true; email: true; image: true } }>,
) {
  return {
    id: author.id,
    name: author.name,
    email: author.email,
    image: author.image,
  };
}

function mapCategory(
  category: { id: string; name: string; slug: string } | null,
): BlogCategoryRef | null {
  if (!category) return null;
  return { id: category.id, name: category.name, slug: category.slug };
}

function mapTags(
  tags: Array<{ tag: { id: string; name: string; slug: string } }>,
): BlogTagRef[] {
  return tags.map(({ tag }) => ({ id: tag.id, name: tag.name, slug: tag.slug }));
}

function statusToPublished(status: BlogPostStatus): boolean {
  return status === "PUBLISHED";
}

function mapListItem(
  post: Prisma.BlogPostGetPayload<{ include: typeof postListInclude }>,
): BlogPostListItem {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    status: post.status,
    isPublished: post.isPublished,
    isFeatured: post.isFeatured,
    publishedAt: post.publishedAt,
    viewCount: post.viewCount,
    categoryName: post.category?.name ?? null,
    authorName: post.author.name ?? post.author.email,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function mapDetail(
  post: Prisma.BlogPostGetPayload<{ include: typeof postDetailInclude }>,
): BlogPostDetail {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    categoryId: post.categoryId,
    category: mapCategory(post.category),
    authorId: post.authorId,
    author: mapAuthor(post.author),
    status: post.status,
    isPublished: post.isPublished,
    isFeatured: post.isFeatured,
    publishedAt: post.publishedAt,
    viewCount: post.viewCount,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    metaKeywords: post.metaKeywords,
    ogImage: post.ogImage,
    canonicalUrl: post.canonicalUrl,
    tags: mapTags(post.tags),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function mapPublicListItem(post: PublicListPostRow): PublicBlogListItem {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    viewCount: post.viewCount,
    isFeatured: post.isFeatured,
    category: mapCategory(post.category),
    author: mapAuthor(post.author),
    tags: mapTags(post.tags),
  };
}

function buildPostData(input: BlogPostFormInput, userId: string, isCreate: boolean) {
  const isPublished = statusToPublished(input.status);
  const publishedAt =
    input.publishedAt && input.publishedAt.length > 0
      ? new Date(input.publishedAt)
      : isPublished
        ? new Date()
        : null;

  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt || null,
    content: input.content,
    coverImage: input.coverImage || null,
    categoryId: input.categoryId || null,
    authorId: input.authorId,
    status: input.status,
    isPublished,
    isFeatured: input.isFeatured,
    publishedAt: isPublished ? publishedAt : null,
    metaTitle: input.metaTitle || null,
    metaDescription: input.metaDescription || null,
    metaKeywords: input.metaKeywords || null,
    ogImage: input.ogImage || null,
    canonicalUrl: input.canonicalUrl || null,
    ...(isCreate ? auditCreateFields(userId) : auditUpdateFields(userId)),
  };
}

export class BlogRepository extends BaseRepository {
  async findMany(filters: BlogPostListFilters): Promise<BlogPostListResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.BlogPostWhereInput = {
      ...activeOnly,
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: "insensitive" } },
              { slug: { contains: filters.search, mode: "insensitive" } },
              { excerpt: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.status && filters.status !== "all" ? { status: filters.status } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.authorId ? { authorId: filters.authorId } : {}),
      ...(filters.isFeatured !== undefined ? { isFeatured: filters.isFeatured } : {}),
      ...(filters.createdFrom || filters.createdTo
        ? {
            createdAt: {
              ...(filters.createdFrom ? { gte: new Date(filters.createdFrom) } : {}),
              ...(filters.createdTo ? { lte: new Date(`${filters.createdTo}T23:59:59`) } : {}),
            },
          }
        : {}),
    };

    const orderBy: Prisma.BlogPostOrderByWithRelationInput = {
      [filters.sortBy ?? "createdAt"]: filters.sortOrder ?? "desc",
    };

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: postListInclude,
        orderBy,
        skip,
        take,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const paginated = toPaginatedResult(items.map(mapListItem), total, { page, pageSize });

    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findById(id: string): Promise<BlogPostDetail | null> {
    const post = await prisma.blogPost.findFirst({
      where: { id, ...activeOnly },
      include: postDetailInclude,
    });
    return post ? mapDetail(post) : null;
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug,
        ...activeOnly,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return Boolean(existing);
  }

  async create(input: BlogPostFormInput, userId: string) {
    const data = buildPostData(input, userId, true);

    return prisma.blogPost.create({
      data: {
        ...data,
        tags: {
          create: input.tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: postDetailInclude,
    });
  }

  async update(id: string, input: BlogPostFormInput, userId: string) {
    const data = buildPostData(input, userId, false);

    await prisma.blogPostTag.deleteMany({ where: { postId: id } });

    return prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        tags: {
          create: input.tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: postDetailInclude,
    });
  }

  async updateStatus(id: string, status: BlogPostStatus, userId: string) {
    const isPublished = statusToPublished(status);
    const existing = await prisma.blogPost.findFirst({ where: { id, ...activeOnly } });

    return prisma.blogPost.update({
      where: { id },
      data: {
        status,
        isPublished,
        publishedAt:
          isPublished && !existing?.publishedAt ? new Date() : isPublished ? existing?.publishedAt : null,
        ...auditUpdateFields(userId),
      },
      include: postDetailInclude,
    });
  }

  async softDelete(id: string, userId: string) {
    return prisma.blogPost.update({
      where: { id },
      data: { ...softDeleteData(), ...auditUpdateFields(userId) },
    });
  }

  async findPublicMany(filters: PublicBlogFilters = {}): Promise<{
    items: PublicBlogListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.BlogPostWhereInput = {
      ...activeOnly,
      status: "PUBLISHED",
      isPublished: true,
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: "insensitive" } },
              { excerpt: { contains: filters.search, mode: "insensitive" } },
              { content: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.categorySlug
        ? { category: { slug: filters.categorySlug, ...activeOnly } }
        : {}),
      ...(filters.tagSlug
        ? { tags: { some: { tag: { slug: filters.tagSlug, ...activeOnly } } } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: postPublicListSelect,
        orderBy: { publishedAt: "desc" },
        skip,
        take,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const paginated = toPaginatedResult(
      items.map((post) => mapPublicListItem(post)),
      total,
      { page, pageSize },
    );

    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findPublishedBySlug(slug: string): Promise<PublicBlogPost | null> {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED", isPublished: true, ...activeOnly },
      include: postDetailInclude,
    });

    if (!post) return null;

    return {
      ...mapPublicListItem(post),
      content: post.content,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
      ogImage: post.ogImage,
      canonicalUrl: post.canonicalUrl,
    };
  }

  async findRelatedPosts(postId: string, categoryId: string | null, limit = 3) {
    const where: Prisma.BlogPostWhereInput = {
      ...activeOnly,
      status: "PUBLISHED",
      isPublished: true,
      id: { not: postId },
      ...(categoryId ? { categoryId } : {}),
    };

    const items = await prisma.blogPost.findMany({
      where,
      select: postPublicListSelect,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return items.map((post) => mapPublicListItem(post));
  }

  async incrementViewCount(postId: string) {
    return prisma.blogPost.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });
  }

  async getLookupData(): Promise<BlogLookupData> {
    const [categories, tags, authors] = await Promise.all([
      prisma.blogCategory.findMany({
        where: { ...activeOnly, isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      prisma.blogTag.findMany({
        where: activeOnly,
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      prisma.user.findMany({
        where: { ...activeOnly, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true, image: true },
      }),
    ]);

    return { categories, tags, authors };
  }

  async listCategories(): Promise<BlogCategoryListItem[]> {
    const categories = await prisma.blogCategory.findMany({
      where: activeOnly,
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { posts: { where: activeOnly } } } },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      postCount: category._count.posts,
    }));
  }

  async createCategory(input: BlogCategoryFormInput) {
    return prisma.blogCategory.create({ data: input });
  }

  async updateCategory(id: string, input: BlogCategoryFormInput) {
    return prisma.blogCategory.update({ where: { id }, data: input });
  }

  async softDeleteCategory(id: string) {
    return prisma.blogCategory.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  async categorySlugExists(slug: string, excludeId?: string) {
    const existing = await prisma.blogCategory.findFirst({
      where: { slug, ...activeOnly, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    return Boolean(existing);
  }

  async listTags(): Promise<BlogTagListItem[]> {
    const tags = await prisma.blogTag.findMany({
      where: activeOnly,
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag._count.posts,
    }));
  }

  async createTag(input: BlogTagFormInput) {
    return prisma.blogTag.create({ data: input });
  }

  async updateTag(id: string, input: BlogTagFormInput) {
    return prisma.blogTag.update({ where: { id }, data: input });
  }

  async softDeleteTag(id: string) {
    return prisma.blogTag.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  async tagSlugExists(slug: string, excludeId?: string) {
    const existing = await prisma.blogTag.findFirst({
      where: { slug, ...activeOnly, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    return Boolean(existing);
  }

  async findCategoryBySlug(slug: string) {
    return prisma.blogCategory.findFirst({
      where: { slug, isActive: true, ...activeOnly },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
      },
    });
  }

  async findTagBySlug(slug: string) {
    return prisma.blogTag.findFirst({
      where: { slug, ...activeOnly },
      select: { id: true, name: true, slug: true },
    });
  }

  async listPublishedSlugs() {
    return prisma.blogPost.findMany({
      where: { status: "PUBLISHED", isPublished: true, ...activeOnly },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
  }

  async listActiveCategorySlugs() {
    return prisma.blogCategory.findMany({
      where: { isActive: true, ...activeOnly },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    });
  }
}

export const blogRepository = new BlogRepository();
