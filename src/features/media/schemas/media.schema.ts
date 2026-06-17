import { MediaType } from "@prisma/client";
import { z } from "zod";

export const mediaListFiltersSchema = z.object({
  search: z.string().optional(),
  folderId: z.string().optional(),
  mediaType: z.nativeEnum(MediaType).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

export type MediaListFiltersInput = z.infer<typeof mediaListFiltersSchema>;

export const mediaMetadataSchema = z.object({
  alt: z.string().trim().max(500).optional(),
  caption: z.string().trim().max(1000).optional(),
  folderId: z.string().optional(),
});

export type MediaMetadataInput = z.infer<typeof mediaMetadataSchema>;

export const propertyVideoUrlSchema = z.object({
  url: z.string().url("Geçerli bir video URL'si girin"),
  title: z.string().trim().max(200).optional(),
});

export type PropertyVideoUrlInput = z.infer<typeof propertyVideoUrlSchema>;

export const reorderImagesSchema = z.object({
  propertyId: z.string().min(1),
  imageIds: z.array(z.string().min(1)).min(1),
});

export type ReorderImagesInput = z.infer<typeof reorderImagesSchema>;
