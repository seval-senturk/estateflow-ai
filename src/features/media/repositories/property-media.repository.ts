import type { MediaProvider, Prisma } from "@prisma/client";

import { prisma } from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";
import { buildCloudinaryUrl, buildCloudinaryVideoUrl } from "@/lib/cloudinary/transform";

import type { PropertyImageItem, PropertyMediaBundle, PropertyVideoItem, PublicGalleryImage, PublicGalleryVideo } from "../types";

const propertyImageInclude = {
  media: true,
} satisfies Prisma.PropertyImageInclude;

const propertyVideoInclude = {
  media: true,
} satisfies Prisma.PropertyVideoInclude;

function resolveImageUrl(image: Prisma.PropertyImageGetPayload<{ include: typeof propertyImageInclude }>) {
  if (image.media?.secureUrl) return image.media.secureUrl;
  if (image.media?.url) return image.media.url;
  if (image.url) return image.url;
  if (image.media?.publicId) return buildCloudinaryUrl(image.media.publicId, { width: 1280, crop: "fill" });
  return "";
}

function mapPropertyImage(
  image: Prisma.PropertyImageGetPayload<{ include: typeof propertyImageInclude }>,
): PropertyImageItem {
  return {
    id: image.id,
    mediaId: image.mediaId,
    url: resolveImageUrl(image),
    alt: image.alt ?? image.media?.alt ?? null,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
    publicId: image.media?.publicId ?? null,
    width: image.media?.width ?? null,
    height: image.media?.height ?? null,
  };
}

function getVideoThumbnail(
  video: Prisma.PropertyVideoGetPayload<{ include: typeof propertyVideoInclude }>,
): string | null {
  if (video.media?.publicId) {
    return buildCloudinaryVideoUrl(video.media.publicId, 640);
  }
  return getExternalVideoThumbnail(video.url);
}

function getExternalVideoThumbnail(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/,
  );
  if (youtubeMatch?.[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }
  return null;
}

export function getVideoEmbedUrl(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/,
  );
  if (youtubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

function mapPropertyVideo(
  video: Prisma.PropertyVideoGetPayload<{ include: typeof propertyVideoInclude }>,
): PropertyVideoItem {
  const url = video.media?.secureUrl ?? video.media?.url ?? video.url;

  return {
    id: video.id,
    mediaId: video.mediaId,
    url,
    provider: video.provider,
    title: video.title,
    sortOrder: video.sortOrder,
    publicId: video.media?.publicId ?? null,
    thumbnailUrl: getVideoThumbnail(video),
  };
}

export class PropertyMediaRepository extends BaseRepository {
  async getPropertyMedia(propertyId: string): Promise<PropertyMediaBundle> {
    const [images, videos] = await Promise.all([
      prisma.propertyImage.findMany({
        where: { propertyId },
        include: propertyImageInclude,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.propertyVideo.findMany({
        where: { propertyId },
        include: propertyVideoInclude,
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return {
      images: images.map(mapPropertyImage),
      videos: videos.map(mapPropertyVideo),
    };
  }

  async getPublicGallery(propertyId: string) {
    const bundle = await this.getPropertyMedia(propertyId);

    const images: PublicGalleryImage[] = bundle.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      caption: null,
      publicId: image.publicId,
      isPrimary: image.isPrimary,
    }));

    const videos: PublicGalleryVideo[] = bundle.videos.map((video) => ({
      id: video.id,
      url: video.url,
      title: video.title,
      provider: video.provider,
      embedUrl: getVideoEmbedUrl(video.url),
      thumbnailUrl: video.thumbnailUrl,
    }));

    return { images, videos };
  }

  async addImageFromMedia(propertyId: string, mediaId: string, alt?: string) {
    const maxOrder = await prisma.propertyImage.aggregate({
      where: { propertyId },
      _max: { sortOrder: true },
    });

    const imageCount = await prisma.propertyImage.count({ where: { propertyId } });
    const media = await prisma.media.findUnique({ where: { id: mediaId } });

    return prisma.propertyImage.create({
      data: {
        propertyId,
        mediaId,
        url: media?.secureUrl ?? media?.url,
        alt: alt ?? media?.alt,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
        isPrimary: imageCount === 0,
      },
      include: propertyImageInclude,
    });
  }

  async addImageAfterUpload(
    propertyId: string,
    data: {
      mediaId: string;
      url: string;
      alt?: string;
    },
  ) {
    const imageCount = await prisma.propertyImage.count({ where: { propertyId } });
    const maxOrder = await prisma.propertyImage.aggregate({
      where: { propertyId },
      _max: { sortOrder: true },
    });

    return prisma.propertyImage.create({
      data: {
        propertyId,
        mediaId: data.mediaId,
        url: data.url,
        alt: data.alt,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
        isPrimary: imageCount === 0,
      },
    });
  }

  async deleteImage(imageId: string, propertyId: string) {
    const image = await prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId },
    });

    if (!image) return null;

    await prisma.propertyImage.delete({ where: { id: imageId } });

    if (image.isPrimary) {
      const next = await prisma.propertyImage.findFirst({
        where: { propertyId },
        orderBy: { sortOrder: "asc" },
      });

      if (next) {
        await prisma.propertyImage.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }

    return image;
  }

  async setPrimaryImage(propertyId: string, imageId: string) {
    await prisma.$transaction([
      prisma.propertyImage.updateMany({
        where: { propertyId },
        data: { isPrimary: false },
      }),
      prisma.propertyImage.update({
        where: { id: imageId, propertyId },
        data: { isPrimary: true },
      }),
    ]);
  }

  async reorderImages(propertyId: string, imageIds: string[]) {
    await prisma.$transaction(
      imageIds.map((id, index) =>
        prisma.propertyImage.update({
          where: { id, propertyId },
          data: { sortOrder: index },
        }),
      ),
    );
  }

  async addExternalVideo(
    propertyId: string,
    data: { url: string; title?: string; provider?: MediaProvider },
  ) {
    const maxOrder = await prisma.propertyVideo.aggregate({
      where: { propertyId },
      _max: { sortOrder: true },
    });

    return prisma.propertyVideo.create({
      data: {
        propertyId,
        url: data.url,
        title: data.title,
        provider: data.provider ?? "EXTERNAL",
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
      include: propertyVideoInclude,
    });
  }

  async addVideoFromMedia(propertyId: string, mediaId: string, title?: string) {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    const maxOrder = await prisma.propertyVideo.aggregate({
      where: { propertyId },
      _max: { sortOrder: true },
    });

    return prisma.propertyVideo.create({
      data: {
        propertyId,
        mediaId,
        url: media?.secureUrl ?? media?.url ?? "",
        title: title ?? media?.caption,
        provider: "CLOUDINARY",
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
      include: propertyVideoInclude,
    });
  }

  async deleteVideo(videoId: string, propertyId: string) {
    return prisma.propertyVideo.delete({
      where: { id: videoId, propertyId },
    });
  }
}

export const propertyMediaRepository = new PropertyMediaRepository();
