import type { Prisma } from "@prisma/client";

import {
  activeOnly,
  auditCreateFields,
  auditUpdateFields,
  prisma,
  softDeleteData,
  toPaginatedResult,
  toPrismaPagination,
} from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";

import type { PropertyDetail, PropertyListFilters, PropertyListItem, PropertyListResult, PublicPropertyDetail, PublicPropertyListItem } from "../types";
import type { PropertyFormInput } from "../schemas";

const propertyListInclude = {
  status: true,
  category: true,
  location: true,
} satisfies Prisma.PropertyInclude;

const propertyDetailInclude = {
  status: true,
  category: true,
  location: true,
  features: {
    include: { feature: true },
  },
} satisfies Prisma.PropertyInclude;

function decimalToNumber(value: Prisma.Decimal | number | null | undefined): number | null {
  if (value == null) return null;
  return Number(value);
}

function mapListItem(
  property: Prisma.PropertyGetPayload<{ include: typeof propertyListInclude }>,
): PropertyListItem {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    price: Number(property.price),
    currency: property.currency,
    city: property.location?.city ?? null,
    district: property.location?.district ?? null,
    categoryName: property.category?.name ?? null,
    statusName: property.status.name,
    statusSlug: property.status.slug,
    statusColor: property.status.color,
    isPublished: property.isPublished,
    createdAt: property.createdAt,
  };
}

export class PropertyRepository extends BaseRepository {
  async findMany(filters: PropertyListFilters): Promise<PropertyListResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.PropertyWhereInput = {
      ...activeOnly,
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: "insensitive" } },
              { slug: { contains: filters.search, mode: "insensitive" } },
              { location: { city: { contains: filters.search, mode: "insensitive" } } },
              { location: { district: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(filters.statusId ? { statusId: filters.statusId } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.isPublished !== undefined ? { isPublished: filters.isPublished } : {}),
      ...(filters.createdFrom || filters.createdTo
        ? {
            createdAt: {
              ...(filters.createdFrom ? { gte: new Date(filters.createdFrom) } : {}),
              ...(filters.createdTo ? { lte: new Date(`${filters.createdTo}T23:59:59`) } : {}),
            },
          }
        : {}),
    };

    const orderBy: Prisma.PropertyOrderByWithRelationInput = {
      [filters.sortBy ?? "createdAt"]: filters.sortOrder ?? "desc",
    };

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: propertyListInclude,
        orderBy,
        skip,
        take,
      }),
      prisma.property.count({ where }),
    ]);

    const paginated = toPaginatedResult(items.map(mapListItem), total, { page, pageSize });

    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findPublishedMany(page = 1, pageSize = 12): Promise<PropertyListResult> {
    return this.findMany({
      page,
      pageSize,
      isPublished: true,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }

  async findPublicMany(page = 1, pageSize = 12) {
    const pageSizeValue = pageSize;
    const { skip, take } = toPrismaPagination({ page, pageSize: pageSizeValue });

    const where: Prisma.PropertyWhereInput = {
      ...activeOnly,
      isPublished: true,
    };

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { location: true },
        orderBy: { publishedAt: "desc" },
        skip,
        take,
      }),
      prisma.property.count({ where }),
    ]);

    const mapped: PublicPropertyListItem[] = items.map((property) => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      shortDescription: property.shortDescription,
      price: Number(property.price),
      currency: property.currency,
      listingType: property.listingType,
      propertyKind: property.propertyKind,
      city: property.location?.city ?? null,
      district: property.location?.district ?? null,
      roomCount: property.roomCount,
      grossArea: decimalToNumber(property.grossArea),
      isFeatured: property.isFeatured,
      publishedAt: property.publishedAt,
    }));

    const paginated = toPaginatedResult(mapped, total, { page, pageSize: pageSizeValue });

    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findById(id: string): Promise<PropertyDetail | null> {
    const property = await prisma.property.findFirst({
      where: { id, ...activeOnly },
      include: propertyDetailInclude,
    });

    if (!property) return null;
    return this.mapDetail(property);
  }

  async findBySlug(slug: string, publishedOnly = false): Promise<PublicPropertyDetail | null> {
    const property = await prisma.property.findFirst({
      where: {
        slug,
        ...activeOnly,
        ...(publishedOnly ? { isPublished: true } : {}),
      },
      include: propertyDetailInclude,
    });

    if (!property) return null;

    return {
      id: property.id,
      title: property.title,
      slug: property.slug,
      shortDescription: property.shortDescription,
      description: property.description,
      price: Number(property.price),
      currency: property.currency,
      listingType: property.listingType,
      propertyKind: property.propertyKind,
      city: property.location?.city ?? null,
      district: property.location?.district ?? null,
      neighborhood: property.location?.neighborhood ?? null,
      address: property.location?.address ?? null,
      roomCount: property.roomCount,
      grossArea: decimalToNumber(property.grossArea),
      netArea: decimalToNumber(property.netArea),
      bathroomCount: property.bathroomCount,
      buildingAge: property.buildingAge,
      floor: property.floor,
      balconyCount: property.balconyCount,
      heatingType: property.heatingType,
      isFeatured: property.isFeatured,
      publishedAt: property.publishedAt,
      metaTitle: property.metaTitle,
      metaDescription: property.metaDescription,
      canonicalUrl: property.canonicalUrl,
      ogImage: property.ogImage,
      features: property.features.map((entry) => ({
        name: entry.feature.name,
        value: entry.value,
      })),
    };
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await prisma.property.findFirst({
      where: {
        slug,
        ...activeOnly,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(existing);
  }

  async create(input: PropertyFormInput, userId: string) {
    return prisma.property.create({
      data: {
        title: input.title,
        slug: input.slug,
        shortDescription: input.shortDescription,
        description: input.description,
        categoryId: input.categoryId || null,
        statusId: input.statusId,
        price: input.price,
        currency: input.currency,
        listingType: input.listingType,
        propertyKind: input.propertyKind,
        grossArea: input.grossArea,
        netArea: input.netArea,
        roomCount: input.roomCount,
        bathroomCount: input.bathroomCount,
        buildingAge: input.buildingAge,
        floor: input.floor,
        balconyCount: input.balconyCount,
        heatingType: input.heatingType,
        isFeatured: input.isFeatured,
        isPublished: input.isPublished,
        publishedAt: input.publishedAt
          ? new Date(input.publishedAt)
          : input.isPublished
            ? new Date()
            : null,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl || null,
        ogImage: input.ogImage || null,
        agentId: userId,
        ...auditCreateFields(userId),
        location: {
          create: {
            city: input.city,
            district: input.district,
            neighborhood: input.neighborhood,
            address: input.address,
            latitude: input.latitude,
            longitude: input.longitude,
          },
        },
        features: {
          create: input.features
            .filter((feature) => feature.value === "true")
            .map((feature) => ({
              featureId: feature.featureId,
              value: feature.value,
            })),
        },
      },
    });
  }

  async update(id: string, input: PropertyFormInput, userId: string) {
    await prisma.propertyFeatureValue.deleteMany({ where: { propertyId: id } });

    return prisma.property.update({
      where: { id },
      data: {
        title: input.title,
        slug: input.slug,
        shortDescription: input.shortDescription,
        description: input.description,
        categoryId: input.categoryId || null,
        statusId: input.statusId,
        price: input.price,
        currency: input.currency,
        listingType: input.listingType,
        propertyKind: input.propertyKind,
        grossArea: input.grossArea,
        netArea: input.netArea,
        roomCount: input.roomCount,
        bathroomCount: input.bathroomCount,
        buildingAge: input.buildingAge,
        floor: input.floor,
        balconyCount: input.balconyCount,
        heatingType: input.heatingType,
        isFeatured: input.isFeatured,
        isPublished: input.isPublished,
        publishedAt: input.publishedAt
          ? new Date(input.publishedAt)
          : input.isPublished
            ? new Date()
            : null,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl || null,
        ogImage: input.ogImage || null,
        ...auditUpdateFields(userId),
        location: {
          upsert: {
            create: {
              city: input.city,
              district: input.district,
              neighborhood: input.neighborhood,
              address: input.address,
              latitude: input.latitude,
              longitude: input.longitude,
            },
            update: {
              city: input.city,
              district: input.district,
              neighborhood: input.neighborhood,
              address: input.address,
              latitude: input.latitude,
              longitude: input.longitude,
            },
          },
        },
        features: {
          create: input.features
            .filter((feature) => feature.value === "true")
            .map((feature) => ({
              featureId: feature.featureId,
              value: feature.value,
            })),
        },
      },
    });
  }

  async softDelete(id: string, userId: string) {
    return prisma.property.update({
      where: { id },
      data: {
        ...softDeleteData(),
        ...auditUpdateFields(userId),
        isPublished: false,
      },
    });
  }

  async updateStatus(id: string, statusId: string, userId: string) {
    return prisma.property.update({
      where: { id },
      data: {
        statusId,
        ...auditUpdateFields(userId),
      },
    });
  }

  async getLookupData() {
    const [statuses, categories, features] = await Promise.all([
      prisma.propertyStatus.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.propertyCategory.findMany({
        where: { ...activeOnly, isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.propertyFeature.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return { statuses, categories, features };
  }

  private mapDetail(
    property: Prisma.PropertyGetPayload<{ include: typeof propertyDetailInclude }>,
  ): PropertyDetail {
    return {
      id: property.id,
      title: property.title,
      slug: property.slug,
      shortDescription: property.shortDescription ?? undefined,
      description: property.description ?? undefined,
      categoryId: property.categoryId ?? undefined,
      statusId: property.statusId,
      statusName: property.status.name,
      statusSlug: property.status.slug,
      statusColor: property.status.color,
      categoryName: property.category?.name ?? null,
      price: Number(property.price),
      currency: property.currency,
      listingType: property.listingType,
      propertyKind: property.propertyKind,
      city: property.location?.city ?? "",
      district: property.location?.district ?? undefined,
      neighborhood: property.location?.neighborhood ?? undefined,
      address: property.location?.address ?? undefined,
      latitude: decimalToNumber(property.location?.latitude) ?? undefined,
      longitude: decimalToNumber(property.location?.longitude) ?? undefined,
      grossArea: decimalToNumber(property.grossArea) ?? undefined,
      netArea: decimalToNumber(property.netArea) ?? undefined,
      roomCount: property.roomCount ?? undefined,
      bathroomCount: property.bathroomCount ?? undefined,
      buildingAge: property.buildingAge ?? undefined,
      floor: property.floor ?? undefined,
      balconyCount: property.balconyCount ?? undefined,
      heatingType: property.heatingType ?? undefined,
      isFeatured: property.isFeatured,
      isPublished: property.isPublished,
      publishedAt: property.publishedAt?.toISOString(),
      metaTitle: property.metaTitle ?? undefined,
      metaDescription: property.metaDescription ?? undefined,
      canonicalUrl: property.canonicalUrl ?? undefined,
      ogImage: property.ogImage ?? undefined,
      viewCount: property.viewCount,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      features: property.features.map((entry) => ({
        featureId: entry.featureId,
        value: entry.value,
      })),
      featureDefinitions: property.features.map((entry) => ({
        id: entry.feature.id,
        name: entry.feature.name,
        slug: entry.feature.slug,
        value: entry.value,
      })),
    };
  }
}

export const propertyRepository = new PropertyRepository();
