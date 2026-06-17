"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Film, Trash2 } from "lucide-react";

import { Button, Input } from "@/components/shared";

import { addPropertyVideoUrlAction, deletePropertyVideoAction } from "../actions";
import type { PropertyVideoItem } from "../types";
import { MediaUploadZone } from "./media-upload-zone";

interface PropertyVideoManagerProps {
  propertyId: string;
  videos: PropertyVideoItem[];
  canUpdate: boolean;
}

export function PropertyVideoManager({
  propertyId,
  videos: initialVideos,
  canUpdate,
}: PropertyVideoManagerProps) {
  const router = useRouter();
  const [videos, setVideos] = useState(initialVideos);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAddUrl = () => {
    setError(null);
    startTransition(async () => {
      const result = await addPropertyVideoUrlAction(propertyId, { url, title: title || undefined });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setUrl("");
      setTitle("");
      router.refresh();
    });
  };

  const handleDelete = (videoId: string) => {
    if (!window.confirm("Bu videoyu silmek istiyor musunuz?")) return;
    startTransition(async () => {
      await deletePropertyVideoAction(propertyId, videoId);
      setVideos((current) => current.filter((video) => video.id !== videoId));
      router.refresh();
    });
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Video Yönetimi</h3>
        <p className="text-sm text-muted-foreground">
          YouTube, Vimeo URL veya Cloudinary video yükleyin.
        </p>
      </div>

      {canUpdate ? (
        <div className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Video URL"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
            <Input
              label="Başlık (isteğe bağlı)"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <Button type="button" onClick={handleAddUrl} disabled={!url || isPending}>
            URL Ekle
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <MediaUploadZone
            folderSlug="properties"
            propertyId={propertyId}
            accept="video"
            onUploadComplete={() => router.refresh()}
          />
        </div>
      ) : null}

      {videos.length === 0 ? (
        <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">Henüz video eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {video.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title ?? "Video"}
                    className="size-full object-cover"
                  />
                ) : (
                  <Film className="size-6 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{video.title ?? "Video"}</p>
                <p className="truncate text-xs text-muted-foreground">{video.url}</p>
              </div>
              {canUpdate ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(video.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
