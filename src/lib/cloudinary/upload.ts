import type { UploadApiResponse } from "cloudinary";

import { cloudinaryConfig } from "@/config/cloudinary";

import { getCloudinaryClient } from "./client";

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  resourceType: "image" | "video" | "raw";
}

function mapUploadResult(result: UploadApiResponse): CloudinaryUploadResult {
  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    format: result.format ?? null,
    width: result.width ?? null,
    height: result.height ?? null,
    bytes: result.bytes ?? null,
    resourceType: result.resource_type as CloudinaryUploadResult["resourceType"],
  };
}

export async function uploadToCloudinary(
  file: Buffer,
  options: {
    folder: string;
    filename?: string;
    resourceType?: "image" | "video" | "auto";
  },
): Promise<CloudinaryUploadResult> {
  const cloudinary = getCloudinaryClient();
  const folder = `${cloudinaryConfig.folderPrefix}/${options.folder}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.filename,
        resource_type: options.resourceType ?? "auto",
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary yükleme başarısız"));
          return;
        }
        resolve(mapUploadResult(result));
      },
    );

    uploadStream.end(file);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image",
): Promise<void> {
  const cloudinary = getCloudinaryClient();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export async function replaceInCloudinary(
  publicId: string,
  file: Buffer,
  resourceType: "image" | "video" = "image",
): Promise<CloudinaryUploadResult> {
  const cloudinary = getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary değiştirme başarısız"));
          return;
        }
        resolve(mapUploadResult(result));
      },
    );

    uploadStream.end(file);
  });
}
