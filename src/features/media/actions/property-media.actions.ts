"use server";

import { revalidatePath } from "next/cache";

import { routes } from "@/config/routes";
import { permissions } from "@/config/permissions";
import { requirePermission } from "@/lib/authorization/guards";

import { propertyMediaService } from "../services";
import type { PropertyVideoUrlInput, ReorderImagesInput } from "../schemas";

function revalidatePropertyPaths(propertyId: string) {
  revalidatePath(routes.admin.propertyDetail(propertyId));
  revalidatePath(routes.admin.propertyEdit(propertyId));
  revalidatePath(routes.admin.propertyPreview(propertyId));
  revalidatePath(routes.public.properties);
}

export async function getPropertyMediaAction(propertyId: string) {
  await requirePermission(permissions.properties.read);
  return propertyMediaService.getPropertyMedia(propertyId);
}

export async function addPropertyImageFromLibraryAction(
  propertyId: string,
  mediaId: string,
  alt?: string,
) {
  await requirePermission(permissions.properties.update);
  const result = await propertyMediaService.addImageFromLibrary(propertyId, mediaId, alt);

  if (result.success) {
    revalidatePropertyPaths(propertyId);
  }

  return result;
}

export async function deletePropertyImageAction(propertyId: string, imageId: string) {
  await requirePermission(permissions.properties.update);
  const result = await propertyMediaService.deleteImage(propertyId, imageId);

  if (result.success) {
    revalidatePropertyPaths(propertyId);
  }

  return result;
}

export async function setPropertyPrimaryImageAction(propertyId: string, imageId: string) {
  await requirePermission(permissions.properties.update);
  const result = await propertyMediaService.setPrimaryImage(propertyId, imageId);

  if (result.success) {
    revalidatePropertyPaths(propertyId);
  }

  return result;
}

export async function reorderPropertyImagesAction(input: ReorderImagesInput) {
  await requirePermission(permissions.properties.update);
  const result = await propertyMediaService.reorderImages(input);

  if (result.success) {
    revalidatePropertyPaths(input.propertyId);
  }

  return result;
}

export async function addPropertyVideoUrlAction(
  propertyId: string,
  input: PropertyVideoUrlInput,
) {
  await requirePermission(permissions.properties.update);
  const result = await propertyMediaService.addExternalVideo(propertyId, input);

  if (result.success) {
    revalidatePropertyPaths(propertyId);
  }

  return result;
}

export async function deletePropertyVideoAction(propertyId: string, videoId: string) {
  await requirePermission(permissions.properties.update);
  const result = await propertyMediaService.deleteVideo(propertyId, videoId);

  if (result.success) {
    revalidatePropertyPaths(propertyId);
  }

  return result;
}
