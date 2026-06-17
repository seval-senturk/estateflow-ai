export const MEDIA_ERROR_CODES = {
  NOT_FOUND: "MEDIA_NOT_FOUND",
  VALIDATION: "MEDIA_VALIDATION_ERROR",
  CLOUDINARY: "MEDIA_CLOUDINARY_ERROR",
  UPLOAD: "MEDIA_UPLOAD_ERROR",
  PERMISSION: "MEDIA_PERMISSION_ERROR",
  NETWORK: "MEDIA_NETWORK_ERROR",
} as const;

export const MEDIA_FOLDER_SLUGS = {
  PROPERTIES: "properties",
  BLOG: "blog",
  USERS: "users",
  COMPANY: "company",
  GENERAL: "general",
} as const;

export const MEDIA_TYPE_LABELS = {
  IMAGE: "Görsel",
  VIDEO: "Video",
  DOCUMENT: "Belge",
  AUDIO: "Ses",
  OTHER: "Diğer",
} as const;

export const MAX_UPLOAD_SIZE_MB = 25;
export const MAX_BULK_UPLOAD_COUNT = 20;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;
