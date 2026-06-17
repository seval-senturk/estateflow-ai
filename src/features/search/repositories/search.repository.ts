import { prisma } from "@/lib/database";
import { activeOnly } from "@/lib/database/helpers";

import type { PublicSearchFilterOptions } from "../types";

export class SearchRepository {
  async getPublicFilterOptions(city?: string): Promise<PublicSearchFilterOptions> {
    const publishedWhere = {
      isPublished: true,
      ...activeOnly,
    };

    const [categories, features, cityRows, districtRows] = await Promise.all([
      prisma.propertyCategory.findMany({
        where: { ...activeOnly, isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { slug: true, name: true },
      }),
      prisma.propertyFeature.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { slug: true, name: true },
      }),
      prisma.propertyLocation.findMany({
        where: { property: publishedWhere },
        select: { city: true },
        distinct: ["city"],
        orderBy: { city: "asc" },
      }),
      city
        ? prisma.propertyLocation.findMany({
            where: {
              city: { equals: city, mode: "insensitive" },
              property: publishedWhere,
            },
            select: { district: true },
            distinct: ["district"],
            orderBy: { district: "asc" },
          })
        : Promise.resolve([]),
    ]);

    return {
      categories,
      features,
      cities: cityRows.map((row) => row.city).filter(Boolean),
      districts: districtRows
        .map((row) => row.district)
        .filter((value): value is string => Boolean(value)),
    };
  }
}

export const searchRepository = new SearchRepository();
