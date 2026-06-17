import { PrismaClient } from "@prisma/client";

import { databaseConfig } from "./config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const logLevel =
    databaseConfig.logLevels[
      process.env.NODE_ENV as keyof typeof databaseConfig.logLevels
    ] ?? databaseConfig.logLevels.production;

  return new PrismaClient({
    log: databaseConfig.logQueries ? [...logLevel] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type DatabaseClient = typeof prisma;
