import type { MediaType, Prisma } from "@prisma/client";

import { activeOnly, prisma, softDeleteData, toPaginatedResult, toPrismaPagination } from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";

import type { MediaDetail, MediaListFilters, MediaListItem, MediaListResult, MediaUsageInfo } from "../types";

const mediaInclude = {
  folder: true,
  uploadedBy: { select: { name: true } },
  usages: true,
  propertyImages: { include: { property: { select: { title: true } } } },
  propertyVideos: { include: { property: { select: { title: true } } } },
} satisfies Prisma.MediaInclude;

function mapUsages(
  media: Prisma.MediaGetPayload<{ include: typeof mediaInclude }>,
): MediaUsageInfo[] {
  const usages: MediaUsageInfo[] = [];

  for (const usage of media.usages) {
    usages.push({
      entityType: usage.entityType,
      entityId: usage.entityId,
      label: `${usage.entityType} #${usage.entityId.slice(0, 8)}`,
    });
  }

  for (const image of media.propertyImages) {
    usages.push({
      entityType: "property",
      entityId: image.propertyId,
      label: image.property.title,
    });
  }

  for (const video of media.propertyVideos) {
    usages.push({
      entityType: "property",
      entityId: video.propertyId,
      label: video.property.title,
    });
  }

  return usages;
}

function mapMediaItem(
  media: Prisma.MediaGetPayload<{ include: typeof mediaInclude }>,
): MediaListItem {
  return {
    id: media.id,
    filename: media.filename,
    originalName: media.originalName,
    mimeType: media.mimeType,
    mediaType: media.mediaType,
    provider: media.provider,
    publicId: media.publicId,
    url: media.secureUrl ?? media.url,
    secureUrl: media.secureUrl,
    format: media.format,
    width: media.width,
    height: media.height,
    bytes: media.bytes,
    folderId: media.folderId,
    folderName: media.folder?.name ?? null,
    alt: media.alt,
    caption: media.caption,
    createdAt: media.createdAt,
    usages: mapUsages(media),
  };
}

export class MediaRepository extends BaseRepository {
  async findMany(filters: MediaListFilters): Promise<MediaListResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 24;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.MediaWhereInput = {
      ...activeOnly,
      ...(filters.search
        ? {
            OR: [
              { filename: { contains: filters.search, mode: "insensitive" } },
              { originalName: { contains: filters.search, mode: "insensitive" } },
              { alt: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.folderId ? { folderId: filters.folderId } : {}),
      ...(filters.mediaType ? { mediaType: filters.mediaType } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: mediaInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.media.count({ where }),
    ]);

    const paginated = toPaginatedResult(items.map(mapMediaItem), total, { page, pageSize });

    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findById(id: string): Promise<MediaDetail | null> {
    const media = await prisma.media.findFirst({
      where: { id, ...activeOnly },
      include: mediaInclude,
    });

    if (!media) return null;

    return {
      ...mapMediaItem(media),
      uploadedByName: media.uploadedBy?.name ?? null,
    };
  }

  async findByPublicId(publicId: string) {
    return prisma.media.findFirst({
      where: { publicId, ...activeOnly },
    });
  }

  async create(data: {
    filename: string;
    originalName?: string;
    mimeType?: string;
    mediaType: MediaType;
    publicId?: string;
    url: string;
    secureUrl?: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    folderId?: string;
    alt?: string;
    caption?: string;
    uploadedById: string;
  }) {
    return prisma.media.create({ data });
  }

  async updateMetadata(
    id: string,
    data: { alt?: string; caption?: string; folderId?: string | null },
  ) {
    return prisma.media.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.media.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  async getFolders() {
    return prisma.mediaFolder.findMany({
      where: { ...activeOnly },
      orderBy: { name: "asc" },
    });
  }

  async getFolderBySlug(slug: string) {
    return prisma.mediaFolder.findFirst({
      where: { slug, ...activeOnly },
    });
  }
}

export const mediaRepository = new MediaRepository();
