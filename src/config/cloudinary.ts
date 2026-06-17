import { serverEnv } from "./environment";

export const cloudinaryConfig = {
  cloudName: serverEnv.CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: serverEnv.CLOUDINARY_API_KEY ?? "",
  apiSecret: serverEnv.CLOUDINARY_API_SECRET ?? "",
  folderPrefix: "estateflow",
} as const;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    cloudinaryConfig.cloudName &&
      cloudinaryConfig.apiKey &&
      cloudinaryConfig.apiSecret,
  );
}
