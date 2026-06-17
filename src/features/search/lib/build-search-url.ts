import { routes } from "@/config/routes";
import type { PublicPropertyFilters } from "@/features/properties/types";

import { SORT_OPTIONS } from "../constants";

interface BuildSearchUrlOptions {
  view?: "grid" | "list";
  map?: boolean;
  page?: number;
}

function getSortPreset(filters: PublicPropertyFilters): string | undefined {
  const match = SORT_OPTIONS.find(
    (option) => option.sortBy === filters.sortBy && option.sortOrder === filters.sortOrder,
  );
  return match?.value;
}

export function buildSearchUrl(
  filters: PublicPropertyFilters,
  options: BuildSearchUrlOptions = {},
): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.listingType) params.set("listingType", filters.listingType);
  if (filters.propertyKind) params.set("kind", filters.propertyKind);
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.currency) params.set("currency", filters.currency);
  if (filters.roomCount) params.set("rooms", filters.roomCount);
  if (filters.minBathrooms != null) params.set("minBathrooms", String(filters.minBathrooms));
  if (filters.maxBathrooms != null) params.set("maxBathrooms", String(filters.maxBathrooms));
  if (filters.minFloor != null) params.set("minFloor", String(filters.minFloor));
  if (filters.maxFloor != null) params.set("maxFloor", String(filters.maxFloor));
  if (filters.maxBuildingAge != null) params.set("maxBuildingAge", String(filters.maxBuildingAge));
  if (filters.minGrossArea != null) params.set("minGrossArea", String(filters.minGrossArea));
  if (filters.maxGrossArea != null) params.set("maxGrossArea", String(filters.maxGrossArea));
  if (filters.minNetArea != null) params.set("minNetArea", String(filters.minNetArea));
  if (filters.maxNetArea != null) params.set("maxNetArea", String(filters.maxNetArea));
  if (filters.features?.length) params.set("features", filters.features.join(","));

  const sortPreset = getSortPreset(filters);
  if (sortPreset && sortPreset !== "newest") {
    params.set("sort", sortPreset);
  }

  const page = options.page ?? filters.page ?? 1;
  if (page > 1) params.set("page", String(page));

  if (options.view === "list") params.set("view", "list");
  if (options.map) params.set("map", "1");

  const qs = params.toString();
  return qs ? `${routes.public.properties}?${qs}` : routes.public.properties;
}

export function buildCanonicalSearchUrl(filters: PublicPropertyFilters): string {
  return buildSearchUrl({ ...filters, page: 1 });
}
