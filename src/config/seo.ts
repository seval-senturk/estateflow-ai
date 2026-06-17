import { appConfig } from "./app";
import { clientEnv } from "./environment";

const baseUrl =
  clientEnv.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const seoConfig = {
  defaultTitle: appConfig.name,
  titleTemplate: `%s | ${appConfig.name}`,
  defaultDescription: appConfig.tagline,
  siteUrl: baseUrl,
  openGraph: {
    type: "website" as const,
    locale: "tr_TR",
    siteName: appConfig.name,
  },
  twitter: {
    card: "summary_large_image" as const,
  },
} as const;

export type SeoConfig = typeof seoConfig;
