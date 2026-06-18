import { MediaType } from "@prisma/client";

import { loggableEntities, trackActivity, trackAudit } from "@/lib/logging";
import { isCloudinaryConfigured } from "@/config/cloudinary";
import { ValidationError } from "@/lib/errors";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary/server";
import { BaseService } from "@/services/base.service";
import type { AsyncActionResult } from "@/types";

import { MEDIA_ERROR_CODES, MAX_UPLOAD_SIZE_MB } from "../constants";
import { mediaRepository } from "../repositories";
import { mediaListFiltersSchema, mediaMetadataSchema } from "../schemas";
import type { MediaMetadataInput, MediaListFiltersInput } from "../schemas";
import type { MediaDetail, MediaListResult } from "../types";

function bytesToMb(bytes: number) {
  return bytes / (1024 * 1024);
}

function resolveMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("audio/")) return "AUDIO";
  if (mimeType.includes("pdf") || mimeType.includes("document")) return "DOCUMENT";
  return "OTHER";
}

export class MediaService extends BaseService {
  async list(filters: MediaListFiltersInput): AsyncActionResult<MediaListResult> {
    try {
      const parsed = mediaListFiltersSchema.safeParse(filters);
      if (!parsed.success) {
        throw new ValidationError("Geçersiz medya filtreleri");
      }

      const result = await mediaRepository.findMany(parsed.data);
      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): AsyncActionResult<MediaDetail> {
    try {
      const media = await mediaRepository.findById(id);
      this.assertFound(media, "Media");
      return this.success(media);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async upload(
    file: Buffer,
    input: {
      filename: string;
      mimeType: string;
      folderSlug?: string;
      alt?: string;
      caption?: string;
      propertyId?: string;
    },
    userId: string,
  ): AsyncActionResult<{ id: string }> {
    try {
      if (!isCloudinaryConfigured()) {
        return this.fail(
          "Cloudinary yapılandırması eksik. CLOUDINARY_* ortam değişkenlerini ayarlayın.",
          MEDIA_ERROR_CODES.CLOUDINARY,
        );
      }

      if (bytesToMb(file.length) > MAX_UPLOAD_SIZE_MB) {
        return this.fail(
          `Dosya boyutu ${MAX_UPLOAD_SIZE_MB}MB sınırını aşıyor.`,
          MEDIA_ERROR_CODES.VALIDATION,
        );
      }

      const folder = await mediaRepository.getFolderBySlug(input.folderSlug ?? "general");
      const mediaType = resolveMediaType(input.mimeType);

      const uploadResult = await uploadToCloudinary(file, {
        folder: input.folderSlug ?? "general",
        resourceType: mediaType === "VIDEO" ? "video" : "image",
      });

      const media = await mediaRepository.create({
        filename: uploadResult.publicId.split("/").pop() ?? input.filename,
        originalName: input.filename,
        mimeType: input.mimeType,
        mediaType,
        publicId: uploadResult.publicId,
        url: uploadResult.url,
        secureUrl: uploadResult.secureUrl,
        format: uploadResult.format ?? undefined,
        width: uploadResult.width ?? undefined,
        height: uploadResult.height ?? undefined,
        bytes: uploadResult.bytes ?? undefined,
        folderId: folder?.id,
        alt: input.alt,
        caption: input.caption,
        uploadedById: userId,
      });

      await trackActivity({
        userId,
        action: "UPLOAD",
        entityType: loggableEntities.MEDIA,
        entityId: media.id,
        description: `Medya yüklendi: ${input.filename}`,
      });
      await trackAudit({
        userId,
        action: "CREATE",
        entityType: loggableEntities.MEDIA,
        entityId: media.id,
        newValues: { filename: input.filename, mimeType: input.mimeType },
      });

      return this.success({ id: media.id });
    } catch (error) {
      return this.fail(
        error instanceof Error ? error.message : "Yükleme başarısız",
        MEDIA_ERROR_CODES.UPLOAD,
      );
    }
  }

  async updateMetadata(
    id: string,
    input: MediaMetadataInput,
  ): AsyncActionResult<{ id: string }> {
    try {
      const parsed = mediaMetadataSchema.parse(input);
      const existing = await mediaRepository.findById(id);
      this.assertFound(existing, "Media");

      await mediaRepository.updateMetadata(id, {
        alt: parsed.alt,
        caption: parsed.caption,
        folderId: parsed.folderId ?? undefined,
      });

      return this.success({ id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string, userId?: string): AsyncActionResult<void> {
    try {
      const existing = await mediaRepository.findById(id);
      this.assertFound(existing, "Media");

      if (existing.publicId && isCloudinaryConfigured()) {
        await deleteFromCloudinary(
          existing.publicId,
          existing.mediaType === "VIDEO" ? "video" : "image",
        );
      }

      await mediaRepository.softDelete(id);
      await trackActivity({
        userId,
        action: "DELETE",
        entityType: loggableEntities.MEDIA,
        entityId: id,
        description: `Medya silindi: ${existing.originalName}`,
      });
      await trackAudit({
        userId,
        action: "DELETE",
        entityType: loggableEntities.MEDIA,
        entityId: id,
        oldValues: { originalName: existing.originalName },
      });
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getFolders() {
    return mediaRepository.getFolders();
  }
}

export const mediaService = new MediaService();
