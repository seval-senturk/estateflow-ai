"use client";

import { FileImage, Film, FileText, Music } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";

import { MEDIA_TYPE_LABELS } from "../constants";
import type { MediaListItem } from "../types";

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaTypeIcon({ type }: { type: MediaListItem["mediaType"] }) {
  switch (type) {
    case "VIDEO":
      return <Film className="size-4" />;
    case "DOCUMENT":
      return <FileText className="size-4" />;
    case "AUDIO":
      return <Music className="size-4" />;
    default:
      return <FileImage className="size-4" />;
  }
}

interface MediaCardProps {
  media: MediaListItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function MediaCard({
  media,
  selected = false,
  onSelect,
  onDelete,
  className,
}: MediaCardProps) {
  const isImage = media.mediaType === "IMAGE";
  const isVideo = media.mediaType === "VIDEO";

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
        selected && "ring-2 ring-primary",
        className,
      )}
    >
      <button
        type="button"
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted"
        onClick={() => onSelect?.(media.id)}
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.url}
            alt={media.alt ?? media.filename}
            className="size-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : isVideo ? (
          <div className="flex size-full items-center justify-center bg-muted">
            <Film className="size-10 text-muted-foreground" />
          </div>
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon type={media.mediaType} />
          </div>
        )}
      </button>

      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" title={media.originalName ?? media.filename}>
              {media.originalName ?? media.filename}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(media.bytes)} · {MEDIA_TYPE_LABELS[media.mediaType]}
            </p>
          </div>
          {onDelete ? (
            <button
              type="button"
              className="text-xs text-destructive hover:underline"
              onClick={() => onDelete(media.id)}
            >
              Sil
            </button>
          ) : null}
        </div>

        <p className="text-xs text-muted-foreground">
          {formatDate(media.createdAt)}
          {media.folderName ? ` · ${media.folderName}` : ""}
        </p>

        {media.usages.length > 0 ? (
          <p className="truncate text-xs text-primary" title={media.usages.map((u) => u.label).join(", ")}>
            Kullanım: {media.usages.map((u) => u.label).join(", ")}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Kullanılmıyor</p>
        )}
      </div>
    </article>
  );
}
