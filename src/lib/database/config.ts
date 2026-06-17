import { serverEnv } from "@/config/environment";

export const databaseConfig = {
  url: serverEnv.DATABASE_URL,
  logQueries: serverEnv.NODE_ENV === "development",
  logLevels: {
    development: ["query", "error", "warn"] as const,
    production: ["error"] as const,
    test: ["error"] as const,
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  softDelete: {
    enabled: true,
  },
} as const;

export type DatabaseConfig = typeof databaseConfig;
