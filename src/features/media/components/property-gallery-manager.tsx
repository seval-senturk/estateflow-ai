"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

import {
  deletePropertyImageAction,
  reorderPropertyImagesAction,
  setPropertyPrimaryImageAction,
} from "../actions";
import type { PropertyImageItem } from "../types";
import { MediaUploadZone } from "./media-upload-zone";
import { PropertyVideoManager } from "./property-video-manager";
import type { PropertyVideoItem } from "../types";

interface PropertyGalleryManagerProps {
  propertyId: string;
  images: PropertyImageItem[];
  videos: PropertyVideoItem[];
  canUpdate: boolean;
}

export function PropertyGalleryManager({
  propertyId,
  images: initialImages,
  videos,
  canUpdate,
}: PropertyGalleryManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();

  const moveImage = (index: number, direction: -1 | 1) => {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const current = next[index];
    const swap = next[target];
    if (!current || !swap) return;
    next[index] = swap;
    next[target] = current;
    setImages(next);

    startTransition(async () => {
      await reorderPropertyImagesAction({
        propertyId,
        imageIds: next.map((image) => image.id),
      });
      router.refresh();
    });
  };

  const handleSetPrimary = (imageId: string) => {
    startTransition(async () => {
      await setPropertyPrimaryImageAction(propertyId, imageId);
      setImages((current) =>
        current.map((image) => ({ ...image, isPrimary: image.id === imageId })),
      );
      router.refresh();
    });
  };

  const handleDelete = (imageId: string) => {
    if (!window.confirm("Bu görseli ilandan kaldırmak istiyor musunuz?")) return;
    startTransition(async () => {
      await deletePropertyImageAction(propertyId, imageId);
      setImages((current) => current.filter((image) => image.id !== imageId));
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Görsel Galerisi</h3>
          <p className="text-sm text-muted-foreground">
            Görselleri yükleyin, sıralayın ve kapak görseli seçin.
          </p>
        </div>

        {canUpdate ? (
          <MediaUploadZone
            folderSlug="properties"
            propertyId={propertyId}
            accept="image"
            onUploadComplete={() => router.refresh()}
          />
        ) : null}

        {images.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
            <p className="text-sm text-muted-foreground">Henüz görsel eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "overflow-hidden rounded-xl border border-border bg-card",
                  image.isPrimary && "ring-2 ring-primary",
                )}
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt ?? "İlan görseli"}
                    className="size-full object-cover"
                  />
                  {image.isPrimary ? (
                    <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      Kapak
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === 0 || isPending}
                      onClick={() => moveImage(index, -1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === images.length - 1 || isPending}
                      onClick={() => moveImage(index, 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                  {canUpdate ? (
                    <div className="flex gap-1">
                      {!image.isPrimary ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleSetPrimary(image.id)}
                          title="Kapak yap"
                        >
                          <Star className="size-4" />
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <PropertyVideoManager
        propertyId={propertyId}
        videos={videos}
        canUpdate={canUpdate}
      />
    </div>
  );
}
