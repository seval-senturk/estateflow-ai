"use server";

import { revalidatePath } from "next/cache";

import { routes } from "@/config/routes";
import { permissions } from "@/config/permissions";
import { requirePermission } from "@/lib/authorization/guards";

import { mediaService } from "../services";
import type { MediaListFiltersInput, MediaMetadataInput } from "../schemas";

export async function getMediaListAction(filters: MediaListFiltersInput) {
  await requirePermission(permissions.media.read);
  return mediaService.list(filters);
}

export async function getMediaFoldersAction() {
  await requirePermission(permissions.media.read);
  return mediaService.getFolders();
}

export async function updateMediaMetadataAction(id: string, input: MediaMetadataInput) {
  await requirePermission(permissions.media.update);
  const result = await mediaService.updateMetadata(id, input);

  if (result.success) {
    revalidatePath(routes.admin.media);
  }

  return result;
}

export async function deleteMediaAction(id: string) {
  await requirePermission(permissions.media.delete);
  const result = await mediaService.delete(id);

  if (result.success) {
    revalidatePath(routes.admin.media);
  }

  return result;
}
