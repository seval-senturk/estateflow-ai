import type { MediaProvider, MediaType } from "@prisma/client";

export interface MediaUsageInfo {
  entityType: string;
  entityId: string;
  label: string;
}

export interface MediaListItem {
  id: string;
  filename: string;
  originalName: string | null;
  mimeType: string | null;
  mediaType: MediaType;
  provider: MediaProvider;
  publicId: string | null;
  url: string;
  secureUrl: string | null;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  folderId: string | null;
  folderName: string | null;
  alt: string | null;
  caption: string | null;
  createdAt: Date;
  usages: MediaUsageInfo[];
}

export interface MediaListResult {
  items: MediaListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MediaListFilters {
  search?: string;
  folderId?: string;
  mediaType?: MediaType;
  page?: number;
  pageSize?: number;
}

export interface MediaDetail extends MediaListItem {
  uploadedByName: string | null;
}

export interface PropertyImageItem {
  id: string;
  mediaId: string | null;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  publicId: string | null;
  width: number | null;
  height: number | null;
}

export interface PropertyVideoItem {
  id: string;
  mediaId: string | null;
  url: string;
  provider: MediaProvider;
  title: string | null;
  sortOrder: number;
  publicId: string | null;
  thumbnailUrl: string | null;
}

export interface PropertyMediaBundle {
  images: PropertyImageItem[];
  videos: PropertyVideoItem[];
}

export interface PublicGalleryImage {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  publicId: string | null;
  isPrimary: boolean;
}

export interface PublicGalleryVideo {
  id: string;
  url: string;
  title: string | null;
  provider: MediaProvider;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}
