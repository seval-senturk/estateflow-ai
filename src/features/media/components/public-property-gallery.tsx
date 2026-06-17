"use client";

import { useState } from "react";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

import { GalleryImage, ThumbnailImage } from "@/components/media";
import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

import type { PublicGalleryImage, PublicGalleryVideo } from "../types";

interface PublicPropertyGalleryProps {
  images: PublicGalleryImage[];
  videos: PublicGalleryVideo[];
  title: string;
}

export function PublicPropertyGallery({
  images,
  videos,
  title,
}: PublicPropertyGalleryProps) {
  const sortedImages = [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (sortedImages.length === 0 && videos.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-muted">
        <span className="text-sm text-muted-foreground">Görsel bulunmuyor</span>
      </div>
    );
  }

  const activeImage = sortedImages[activeIndex];

  const showPrev = () => setActiveIndex((i) => (i > 0 ? i - 1 : sortedImages.length - 1));
  const showNext = () => setActiveIndex((i) => (i < sortedImages.length - 1 ? i + 1 : 0));

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
          {activeImage ? (
            <>
              <GalleryImage
                src={activeImage.url}
                alt={activeImage.alt ?? title}
                publicId={activeImage.publicId}
                priority
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute top-3 right-3"
                onClick={() => setLightboxOpen(true)}
              >
                <Expand className="size-4" />
              </Button>
              {sortedImages.length > 1 ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute top-1/2 left-3 -translate-y-1/2"
                    onClick={showPrev}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                    onClick={showNext}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </>
              ) : null}
            </>
          ) : null}
        </div>

        {sortedImages.length > 1 ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {sortedImages.map((image, index) => (
              <ThumbnailImage
                key={image.id}
                src={image.url}
                alt={image.alt ?? title}
                publicId={image.publicId}
                active={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        ) : null}

        {videos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {videos.map((video) => (
              <div key={video.id} className="overflow-hidden rounded-xl border border-border">
                {video.embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={video.embedUrl}
                      title={video.title ?? "Property video"}
                      className="size-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video src={video.url} controls className="w-full" />
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {lightboxOpen && activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="size-5" />
          </Button>
          <div className="relative max-h-[90vh] max-w-6xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.alt ?? title}
              className={cn("max-h-[90vh] w-full object-contain")}
            />
          </div>
          {sortedImages.length > 1 ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white"
                onClick={showPrev}
              >
                <ChevronLeft className="size-6" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white"
                onClick={showNext}
              >
                <ChevronRight className="size-6" />
              </Button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
