import type { PublicPropertyFilters } from "@/features/properties/types";

export interface PublicSearchFilterOptions {
  categories: Array<{ slug: string; name: string }>;
  features: Array<{ slug: string; name: string }>;
  cities: string[];
  districts: string[];
}

export interface SavedSearchDraft {
  id?: string;
  name: string;
  filters: PublicPropertyFilters;
  notifyOnNew?: boolean;
  createdAt?: string;
}

export interface SearchAnalyticsEvent {
  type: "search" | "filter_apply" | "sort_change" | "map_toggle" | "empty_results";
  filters?: Partial<PublicPropertyFilters>;
  resultCount?: number;
  timestamp: string;
}

export interface FavoriteActionPayload {
  propertyId: string;
  action: "add" | "remove";
  source: "listing_card" | "listing_map" | "detail_page";
}
