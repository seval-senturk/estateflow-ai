"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { permissions } from "@/config/permissions";
import { requireAuth, requirePermission } from "@/lib/authorization/guards";
import type { BlogPostStatus } from "@prisma/client";

import { blogService } from "../services";
import type {
  BlogCategoryFormInput,
  BlogListFiltersInput,
  BlogPostFormInput,
  BlogTagFormInput,
} from "../schemas";

export async function createBlogPostAction(input: BlogPostFormInput) {
  const user = await requirePermission(permissions.blog.create);
  const result = await blogService.create(input, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blog);
  revalidatePath(routes.public.blog);
  redirect(routes.admin.blogDetail(result.data.id));
}

export async function updateBlogPostAction(id: string, input: BlogPostFormInput) {
  const user = await requirePermission(permissions.blog.update);
  const result = await blogService.update(id, input, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blog);
  revalidatePath(routes.admin.blogDetail(id));
  revalidatePath(routes.public.blog);
  redirect(routes.admin.blogDetail(id));
}

export async function deleteBlogPostAction(id: string) {
  const user = await requirePermission(permissions.blog.delete);
  const result = await blogService.delete(id, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blog);
  revalidatePath(routes.public.blog);
  redirect(routes.admin.blog);
}

export async function updateBlogPostStatusAction(id: string, status: BlogPostStatus) {
  await requirePermission(permissions.blog.publish);
  const user = await requireAuth();
  const result = await blogService.updateStatus(id, status, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blog);
  revalidatePath(routes.admin.blogDetail(id));
  revalidatePath(routes.public.blog);
  return result;
}

export async function listBlogPostsAction(filters: BlogListFiltersInput) {
  await requirePermission(permissions.blog.read);
  return blogService.list(filters);
}

export async function createBlogCategoryAction(input: BlogCategoryFormInput) {
  await requirePermission(permissions.blog.create);
  const result = await blogService.createCategory(input);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blogCategories);
  revalidatePath(routes.public.blog);
  return result;
}

export async function updateBlogCategoryAction(id: string, input: BlogCategoryFormInput) {
  await requirePermission(permissions.blog.update);
  const result = await blogService.updateCategory(id, input);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blogCategories);
  revalidatePath(routes.public.blog);
  return result;
}

export async function deleteBlogCategoryAction(id: string) {
  await requirePermission(permissions.blog.delete);
  const result = await blogService.deleteCategory(id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blogCategories);
  revalidatePath(routes.public.blog);
  return result;
}

export async function createBlogTagAction(input: BlogTagFormInput) {
  await requirePermission(permissions.blog.create);
  const result = await blogService.createTag(input);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blogTags);
  revalidatePath(routes.public.blog);
  return result;
}

export async function updateBlogTagAction(id: string, input: BlogTagFormInput) {
  await requirePermission(permissions.blog.update);
  const result = await blogService.updateTag(id, input);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blogTags);
  revalidatePath(routes.public.blog);
  return result;
}

export async function deleteBlogTagAction(id: string) {
  await requirePermission(permissions.blog.delete);
  const result = await blogService.deleteTag(id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.blogTags);
  revalidatePath(routes.public.blog);
  return result;
}
