"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { requireAuth, requirePermission } from "@/lib/authorization/guards";
import { permissions } from "@/config/permissions";

import { propertyService } from "../services";
import type { PropertyFormInput } from "../schemas";
import type { PropertyListFiltersInput } from "../schemas";

export async function createPropertyAction(input: PropertyFormInput) {
  const user = await requirePermission(permissions.properties.create);
  const result = await propertyService.create(input, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.properties);
  revalidatePath(routes.public.properties);
  redirect(routes.admin.propertyDetail(result.data.id));
}

export async function updatePropertyAction(id: string, input: PropertyFormInput) {
  const user = await requirePermission(permissions.properties.update);
  const result = await propertyService.update(id, input, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.properties);
  revalidatePath(routes.admin.propertyDetail(id));
  revalidatePath(routes.public.properties);
  redirect(routes.admin.propertyDetail(id));
}

export async function deletePropertyAction(id: string) {
  const user = await requirePermission(permissions.properties.delete);
  const result = await propertyService.delete(id, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.properties);
  revalidatePath(routes.public.properties);
  redirect(routes.admin.properties);
}

export async function updatePropertyStatusAction(id: string, statusId: string) {
  await requirePermission(permissions.properties.update);
  const user = await requireAuth();
  const result = await propertyService.updateStatus(id, statusId, user.id);

  if (!result.success) {
    return result;
  }

  revalidatePath(routes.admin.properties);
  revalidatePath(routes.admin.propertyDetail(id));
  return result;
}

export async function getPropertiesListAction(filters: PropertyListFiltersInput) {
  await requirePermission(permissions.properties.read);
  return propertyService.list(filters);
}
