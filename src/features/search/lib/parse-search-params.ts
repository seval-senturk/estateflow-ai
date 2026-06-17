import type { Currency, ListingType, PropertyKind } from "@prisma/client";

import type { PublicPropertyFilters } from "@/features/properties/types";

import { SORT_OPTIONS } from "../constants";

const LISTING_TYPES = new Set<ListingType>(["FOR_SALE", "FOR_RENT", "DAILY_RENT", "TAKEOVER"]);
const PROPERTY_KINDS = new Set<PropertyKind>([
  "LAND",
  "COMMERCIAL",
  "RESIDENTIAL",
  "VILLA",
  "RESIDENCE",
]);
const CURRENCIES = new Set<Currency>(["TRY", "USD", "EUR", "GBP"]);

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseSort(params: Record<string, string | string[] | undefined>): Pick<
  PublicPropertyFilters,
  "sortBy" | "sortOrder"
> {
  const sortPreset = getParam(params, "sort");
  if (sortPreset) {
    const match = SORT_OPTIONS.find((option) => option.value === sortPreset);
    if (match) {
      return { sortBy: match.sortBy, sortOrder: match.sortOrder };
    }
  }

  const sortByRaw = getParam(params, "sortBy");
  const sortOrderRaw = getParam(params, "sortOrder");

  return {
    sortBy:
      sortByRaw === "price" || sortByRaw === "grossArea" ? sortByRaw : "publishedAt",
    sortOrder: sortOrderRaw === "asc" ? "asc" : "desc",
  };
}

function parseFeatures(params: Record<string, string | string[] | undefined>): string[] | undefined {
  const raw = getParam(params, "features");
  if (!raw) return undefined;
  const slugs = raw.split(",").map((slug) => slug.trim()).filter(Boolean);
  return slugs.length > 0 ? slugs : undefined;
}

export function parsePublicPropertyFilters(
  params: Record<string, string | string[] | undefined>,
): PublicPropertyFilters {
  const pageRaw = Number(getParam(params, "page") ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const listingTypeRaw = getParam(params, "listingType") ?? getParam(params, "type");
  const propertyKindRaw = getParam(params, "kind") ?? getParam(params, "propertyKind");
  const currencyRaw = getParam(params, "currency");

  return {
    page,
    pageSize: 12,
    search: getParam(params, "search"),
    city: getParam(params, "city"),
    district: getParam(params, "district"),
    neighborhood: getParam(params, "neighborhood"),
    categorySlug: getParam(params, "category"),
    listingType:
      listingTypeRaw && LISTING_TYPES.has(listingTypeRaw as ListingType)
        ? (listingTypeRaw as ListingType)
        : undefined,
    propertyKind:
      propertyKindRaw && PROPERTY_KINDS.has(propertyKindRaw as PropertyKind)
        ? (propertyKindRaw as PropertyKind)
        : undefined,
    minPrice: parseNumber(getParam(params, "minPrice")),
    maxPrice: parseNumber(getParam(params, "maxPrice")),
    currency:
      currencyRaw && CURRENCIES.has(currencyRaw as Currency)
        ? (currencyRaw as Currency)
        : undefined,
    roomCount: getParam(params, "rooms") ?? getParam(params, "roomCount"),
    minBathrooms: parseNumber(getParam(params, "minBathrooms")),
    maxBathrooms: parseNumber(getParam(params, "maxBathrooms")),
    minFloor: parseNumber(getParam(params, "minFloor")),
    maxFloor: parseNumber(getParam(params, "maxFloor")),
    maxBuildingAge: parseNumber(getParam(params, "maxBuildingAge")),
    minGrossArea: parseNumber(getParam(params, "minGrossArea")),
    maxGrossArea: parseNumber(getParam(params, "maxGrossArea")),
    minNetArea: parseNumber(getParam(params, "minNetArea")),
    maxNetArea: parseNumber(getParam(params, "maxNetArea")),
    features: parseFeatures(params),
    ...parseSort(params),
  };
}

export function getViewMode(
  params: Record<string, string | string[] | undefined>,
): "grid" | "list" {
  return getParam(params, "view") === "list" ? "list" : "grid";
}

export function isMapViewEnabled(
  params: Record<string, string | string[] | undefined>,
): boolean {
  return getParam(params, "map") === "1";
}
