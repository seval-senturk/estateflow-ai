import { clientEnv } from "./environment";

export const appConfig = {
  name: clientEnv.NEXT_PUBLIC_APP_NAME,
  tagline: "Modern Real Estate Management Platform",
  version: "0.1.0",
  locale: "en-US",
  defaultCurrency: "USD",
  defaultTimezone: "America/New_York",
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },
  upload: {
    maxFileSizeMb: 10,
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  },
} as const;

export type AppConfig = typeof appConfig;
