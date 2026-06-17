import type { ListingType, PropertyKind } from "@prisma/client";

import type { PublicPropertyFilters } from "@/features/properties/types";

const LISTING_TYPES = new Set<ListingType>(["FOR_SALE", "FOR_RENT", "DAILY_RENT", "TAKEOVER"]);
const PROPERTY_KINDS = new Set<PropertyKind>([
  "LAND",
  "COMMERCIAL",
  "RESIDENTIAL",
  "VILLA",
  "RESIDENCE",
]);

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parsePublicPropertyFilters(
  params: Record<string, string | string[] | undefined>,
): PublicPropertyFilters {
  const pageRaw = Number(getParam(params, "page") ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const listingTypeRaw = getParam(params, "listingType") ?? getParam(params, "type");
  const propertyKindRaw = getParam(params, "kind") ?? getParam(params, "propertyKind");

  return {
    page,
    pageSize: 12,
    search: getParam(params, "search"),
    city: getParam(params, "city"),
    listingType:
      listingTypeRaw && LISTING_TYPES.has(listingTypeRaw as ListingType)
        ? (listingTypeRaw as ListingType)
        : undefined,
    propertyKind:
      propertyKindRaw && PROPERTY_KINDS.has(propertyKindRaw as PropertyKind)
        ? (propertyKindRaw as PropertyKind)
        : undefined,
    sortBy: getParam(params, "sortBy") === "price" ? "price" : "publishedAt",
    sortOrder: getParam(params, "sortOrder") === "asc" ? "asc" : "desc",
  };
}

export function getViewMode(
  params: Record<string, string | string[] | undefined>,
): "grid" | "list" {
  return getParam(params, "view") === "list" ? "list" : "grid";
}
