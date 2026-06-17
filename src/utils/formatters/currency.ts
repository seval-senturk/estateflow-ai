import { appConfig } from "@/config/app";

export function formatCurrency(
  amount: number,
  locale: string = appConfig.locale,
  currency: string = appConfig.defaultCurrency,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(
  value: number,
  locale = appConfig.locale,
): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCompactNumber(
  value: number,
  locale = appConfig.locale,
): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

export function formatPercent(
  value: number,
  locale = appConfig.locale,
  decimals = 1,
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}
