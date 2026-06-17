import { formatCurrency, formatDate } from "@/utils/formatters";

import {
  CURRENCY_LABELS,
  HEATING_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_KIND_LABELS,
} from "../constants";

export function formatPropertyPriceValue(
  price: number,
  currency: keyof typeof CURRENCY_LABELS,
) {
  return formatCurrency(price, "tr-TR", currency);
}

export function formatPropertyDate(date: Date | string) {
  return formatDate(date);
}

export function getListingTypeLabel(value: keyof typeof LISTING_TYPE_LABELS) {
  return LISTING_TYPE_LABELS[value];
}

export function getPropertyKindLabel(value: keyof typeof PROPERTY_KIND_LABELS) {
  return PROPERTY_KIND_LABELS[value];
}

export function getHeatingTypeLabel(value: keyof typeof HEATING_TYPE_LABELS) {
  return HEATING_TYPE_LABELS[value];
}
