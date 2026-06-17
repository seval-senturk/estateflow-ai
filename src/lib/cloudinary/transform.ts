import { cloudinaryConfig } from "@/config/cloudinary";
import { clientEnv } from "@/config/environment";

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "thumb";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

export function buildCloudinaryUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {},
): string {
  const cloudName = cloudinaryConfig.cloudName || clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return "";

  const transforms = [
    "f_auto",
    `q_${options.quality ?? "auto"}`,
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : null,
  ]
    .filter(Boolean)
    .join(",");

  const transformSegment = transforms ? `${transforms}/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformSegment}${publicId}`;
}

export function buildCloudinaryVideoUrl(publicId: string, width = 1280): string {
  const cloudName = cloudinaryConfig.cloudName || clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId) return "";

  return `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

export function buildResponsiveSrcSet(
  publicId: string,
  widths = [320, 640, 960, 1280, 1920],
): string {
  return widths
    .map((width) => `${buildCloudinaryUrl(publicId, { width, crop: "fill" })} ${width}w`)
    .join(", ");
}
