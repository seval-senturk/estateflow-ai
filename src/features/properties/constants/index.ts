import { ListingType, PropertyKind, HeatingType, Currency } from "@prisma/client";

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  FOR_SALE: "Satılık",
  FOR_RENT: "Kiralık",
  DAILY_RENT: "Günlük Kiralık",
  TAKEOVER: "Devren",
};

export const PROPERTY_KIND_LABELS: Record<PropertyKind, string> = {
  LAND: "Arsa",
  COMMERCIAL: "İşyeri",
  RESIDENTIAL: "Konut",
  VILLA: "Villa",
  RESIDENCE: "Rezidans",
};

export const HEATING_TYPE_LABELS: Record<HeatingType, string> = {
  NONE: "Yok",
  NATURAL_GAS: "Doğalgaz",
  CENTRAL: "Merkezi",
  COMBI: "Kombi",
  UNDERFLOOR: "Yerden Isıtma",
  AIR_CONDITIONING: "Klima",
  STOVE: "Soba",
  SOLAR: "Güneş Enerjisi",
  HEAT_PUMP: "Isı Pompası",
  OTHER: "Diğer",
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  TRY: "₺ TRY",
  USD: "$ USD",
  EUR: "€ EUR",
  GBP: "£ GBP",
};

export const PROPERTY_DETAIL_TABS = [
  { id: "general", label: "Genel Bilgiler" },
  { id: "location", label: "Konum" },
  { id: "features", label: "Özellikler" },
  { id: "media", label: "Medya" },
  { id: "seo", label: "SEO" },
] as const;

export type PropertyDetailTabId = (typeof PROPERTY_DETAIL_TABS)[number]["id"];

export const PROPERTY_ERROR_CODES = {
  NOT_FOUND: "PROPERTY_NOT_FOUND",
  VALIDATION: "PROPERTY_VALIDATION_ERROR",
  SLUG_CONFLICT: "PROPERTY_SLUG_CONFLICT",
} as const;
