import type { Currency, ListingType, PropertyKind } from "@prisma/client";

import {
  LISTING_TYPE_LABELS,
  PROPERTY_KIND_LABELS,
} from "@/features/properties/constants";

export const SORT_OPTIONS = [
  { value: "newest", label: "En Yeni", sortBy: "publishedAt" as const, sortOrder: "desc" as const },
  { value: "oldest", label: "En Eski", sortBy: "publishedAt" as const, sortOrder: "asc" as const },
  { value: "price_asc", label: "Fiyat (Artan)", sortBy: "price" as const, sortOrder: "asc" as const },
  { value: "price_desc", label: "Fiyat (Azalan)", sortBy: "price" as const, sortOrder: "desc" as const },
  { value: "area_asc", label: "Metrekare (Artan)", sortBy: "grossArea" as const, sortOrder: "asc" as const },
  { value: "area_desc", label: "Metrekare (Azalan)", sortBy: "grossArea" as const, sortOrder: "desc" as const },
] as const;

export type SortPreset = (typeof SORT_OPTIONS)[number]["value"];

export const ROOM_COUNT_OPTIONS = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1"] as const;

export const FEATURED_FILTER_SLUGS = [
  "asansor",
  "otopark",
  "bahce",
  "guvenlik",
  "havuz",
  "merkezi-sistem",
  "fiber-internet",
  "ebeveyn-banyosu",
] as const;

export const LISTING_TYPE_OPTIONS = Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => ({
  value: value as ListingType,
  label,
}));

export const PROPERTY_KIND_OPTIONS = Object.entries(PROPERTY_KIND_LABELS).map(([value, label]) => ({
  value: value as PropertyKind,
  label,
}));

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "TRY", label: "₺ TRY" },
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
  { value: "GBP", label: "£ GBP" },
];

export const EMPTY_STATE_SUGGESTIONS = [
  { label: "Satılık Konut", href: "/properties?listingType=FOR_SALE&kind=RESIDENTIAL" },
  { label: "Kiralık Daire", href: "/properties?listingType=FOR_RENT&kind=RESIDENTIAL" },
  { label: "Villa", href: "/properties?kind=VILLA" },
  { label: "İstanbul", href: "/properties?city=İstanbul" },
] as const;
