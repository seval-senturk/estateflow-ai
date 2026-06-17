import type { PublicPropertyFilters } from "@/features/properties/types";
import {
  CURRENCY_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_KIND_LABELS,
} from "@/features/properties/constants";

import { buildSearchUrl } from "./build-search-url";

export interface ActiveFilterChip {
  key: string;
  label: string;
  removeUrl: string;
}

export function getActiveFilterChips(
  filters: PublicPropertyFilters,
  featureLabels: Record<string, string> = {},
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  const addChip = (key: keyof PublicPropertyFilters | string, label: string) => {
    const next = { ...filters };
    if (key === "features" && filters.features) {
      next.features = undefined;
    } else if (key.startsWith("feature:")) {
      const slug = key.replace("feature:", "");
      next.features = filters.features?.filter((item) => item !== slug);
      if (next.features?.length === 0) next.features = undefined;
    } else {
      (next as Record<string, unknown>)[key] = undefined;
    }
    if (key !== "page") next.page = 1;
    chips.push({ key: String(key), label, removeUrl: buildSearchUrl(next) });
  };

  if (filters.search) addChip("search", `Arama: ${filters.search}`);
  if (filters.city) addChip("city", `Şehir: ${filters.city}`);
  if (filters.district) addChip("district", `İlçe: ${filters.district}`);
  if (filters.neighborhood) addChip("neighborhood", `Mahalle: ${filters.neighborhood}`);
  if (filters.categorySlug) addChip("categorySlug", `Kategori: ${filters.categorySlug}`);
  if (filters.listingType) addChip("listingType", LISTING_TYPE_LABELS[filters.listingType]);
  if (filters.propertyKind) addChip("propertyKind", PROPERTY_KIND_LABELS[filters.propertyKind]);
  if (filters.minPrice != null) addChip("minPrice", `Min: ${filters.minPrice.toLocaleString("tr-TR")}`);
  if (filters.maxPrice != null) addChip("maxPrice", `Max: ${filters.maxPrice.toLocaleString("tr-TR")}`);
  if (filters.currency) addChip("currency", CURRENCY_LABELS[filters.currency]);
  if (filters.roomCount) addChip("roomCount", `Oda: ${filters.roomCount}`);
  if (filters.minBathrooms != null) addChip("minBathrooms", `Min Banyo: ${filters.minBathrooms}`);
  if (filters.maxBathrooms != null) addChip("maxBathrooms", `Max Banyo: ${filters.maxBathrooms}`);
  if (filters.minGrossArea != null) addChip("minGrossArea", `Min m²: ${filters.minGrossArea}`);
  if (filters.maxGrossArea != null) addChip("maxGrossArea", `Max m²: ${filters.maxGrossArea}`);
  if (filters.features?.length) {
    for (const slug of filters.features) {
      addChip(`feature:${slug}`, featureLabels[slug] ?? slug);
    }
  }

  return chips;
}

export function countActiveFilters(
  filters: PublicPropertyFilters,
  featureLabels?: Record<string, string>,
): number {
  return getActiveFilterChips(filters, featureLabels).length;
}
