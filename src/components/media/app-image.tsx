"use client";

import Image from "next/image";

import { buildCloudinaryUrl, buildResponsiveSrcSet } from "@/lib/cloudinary/transform";
import { cn } from "@/lib/utils";

export interface AppImageProps {
  src: string;
  alt: string;
  publicId?: string | null;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  lazy?: boolean;
}

export function AppImage({
  src,
  alt,
  publicId,
  width,
  height,
  className,
  priority = false,
  sizes = "100vw",
  fill = false,
  lazy = true,
}: AppImageProps) {
  const optimizedSrc = publicId
    ? buildCloudinaryUrl(publicId, { width: width ?? 1280, crop: "fill", quality: "auto", format: "auto" })
    : src;

  const srcSet = publicId ? buildResponsiveSrcSet(publicId) : undefined;

  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes={sizes}
        priority={priority}
        loading={lazy && !priority ? "lazy" : undefined}
      />
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={lazy && !priority ? "lazy" : undefined}
      {...(srcSet ? { srcSet } : {})}
    />
  );
}
