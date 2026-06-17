"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { EmptyState } from "@/components/admin/ui/empty-state";
import { Search, Select } from "@/components/shared";
import { Pagination } from "@/components/shared";

import { deleteMediaAction } from "../actions";
import { MEDIA_TYPE_LABELS } from "../constants";
import type { MediaListItem, MediaListResult } from "../types";
import { MediaCard } from "./media-card";
import { MediaUploadZone } from "./media-upload-zone";

interface FolderOption {
  id: string;
  name: string;
}

interface MediaLibraryProps {
  result: MediaListResult;
  folders: FolderOption[];
  canUpload: boolean;
  canDelete: boolean;
}

export function MediaLibrary({
  result,
  folders,
  canUpload,
  canDelete,
}: MediaLibraryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    });
    if (!updates.page) params.delete("page");
    router.push(params.toString() ? `${pathname}?${params}` : pathname);
  };

  const handleDelete = (id: string) => {
    if (!canDelete || !window.confirm("Bu medyayı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteMediaAction(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {canUpload ? (
        <MediaUploadZone
          folderSlug={searchParams.get("folderId") ? undefined : "general"}
          onUploadComplete={() => router.refresh()}
        />
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <Search
          value={searchParams.get("search") ?? ""}
          onSearch={(value) => updateParams({ search: value || undefined })}
          placeholder="Dosya adı veya alt metin ara…"
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          <Select
            label="Klasör"
            value={searchParams.get("folderId") ?? "all"}
            onValueChange={(value) =>
              updateParams({ folderId: value === "all" ? undefined : value ?? undefined })
            }
            options={[
              { label: "Tüm klasörler", value: "all" },
              ...folders.map((folder) => ({ label: folder.name, value: folder.id })),
            ]}
            className="min-w-[160px]"
          />
          <Select
            label="Tür"
            value={searchParams.get("mediaType") ?? "all"}
            onValueChange={(value) =>
              updateParams({ mediaType: value === "all" ? undefined : value ?? undefined })
            }
            options={[
              { label: "Tümü", value: "all" },
              ...Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => ({
                label,
                value,
              })),
            ]}
            className="min-w-[140px]"
          />
        </div>
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="Medya bulunamadı"
          description="Henüz yükleme yapılmamış veya filtrelerinize uygun sonuç yok."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {result.items.map((item: MediaListItem) => (
            <MediaCard
              key={item.id}
              media={item}
              onDelete={canDelete ? handleDelete : undefined}
            />
          ))}
        </div>
      )}

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        onPageChange={(page) => updateParams({ page: String(page) })}
      />

      {isPending ? <p className="text-sm text-muted-foreground">İşlem yapılıyor…</p> : null}
    </div>
  );
}
