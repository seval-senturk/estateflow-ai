import { ValidationError } from "@/lib/errors";
import { BaseService } from "@/services/base.service";
import type { AsyncActionResult } from "@/types";

import { propertyMediaRepository, getVideoEmbedUrl } from "../repositories";
import { propertyVideoUrlSchema, reorderImagesSchema } from "../schemas";
import type { PropertyMediaBundle } from "../types";
import type { PropertyVideoUrlInput, ReorderImagesInput } from "../schemas";

export class PropertyMediaService extends BaseService {
  async getPropertyMedia(propertyId: string): AsyncActionResult<PropertyMediaBundle> {
    try {
      const bundle = await propertyMediaRepository.getPropertyMedia(propertyId);
      return this.success(bundle);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addImageFromLibrary(
    propertyId: string,
    mediaId: string,
    alt?: string,
  ): AsyncActionResult<{ id: string }> {
    try {
      const image = await propertyMediaRepository.addImageFromMedia(propertyId, mediaId, alt);
      return this.success({ id: image.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteImage(propertyId: string, imageId: string): AsyncActionResult<void> {
    try {
      const deleted = await propertyMediaRepository.deleteImage(imageId, propertyId);
      this.assertFound(deleted, "PropertyImage");
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async setPrimaryImage(
    propertyId: string,
    imageId: string,
  ): AsyncActionResult<void> {
    try {
      await propertyMediaRepository.setPrimaryImage(propertyId, imageId);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async reorderImages(input: ReorderImagesInput): AsyncActionResult<void> {
    try {
      const parsed = reorderImagesSchema.parse(input);
      await propertyMediaRepository.reorderImages(parsed.propertyId, parsed.imageIds);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addExternalVideo(
    propertyId: string,
    input: PropertyVideoUrlInput,
  ): AsyncActionResult<{ id: string }> {
    try {
      const parsed = propertyVideoUrlSchema.parse(input);

      if (!getVideoEmbedUrl(parsed.url) && !parsed.url.includes("cloudinary.com")) {
        throw new ValidationError("Yalnızca YouTube, Vimeo veya Cloudinary video URL'leri desteklenir");
      }

      const video = await propertyMediaRepository.addExternalVideo(propertyId, {
        url: parsed.url,
        title: parsed.title,
      });

      return this.success({ id: video.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addVideoFromMedia(
    propertyId: string,
    mediaId: string,
    title?: string,
  ): AsyncActionResult<{ id: string }> {
    try {
      const video = await propertyMediaRepository.addVideoFromMedia(propertyId, mediaId, title);
      return this.success({ id: video.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteVideo(propertyId: string, videoId: string): AsyncActionResult<void> {
    try {
      await propertyMediaRepository.deleteVideo(videoId, propertyId);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPublicGallery(propertyId: string) {
    return propertyMediaRepository.getPublicGallery(propertyId);
  }
}

export const propertyMediaService = new PropertyMediaService();
