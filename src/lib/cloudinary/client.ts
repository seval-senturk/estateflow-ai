import { v2 as cloudinary } from "cloudinary";

import { cloudinaryConfig, isCloudinaryConfigured } from "@/config/cloudinary";

let configured = false;

export function getCloudinaryClient() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary yapılandırması eksik. Ortam değişkenlerini kontrol edin.");
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}
