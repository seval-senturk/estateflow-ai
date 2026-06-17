"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, RefreshCw } from "lucide-react";

import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

import { ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES, MAX_BULK_UPLOAD_COUNT } from "../constants";
import { useMediaUpload } from "../hooks";

interface MediaUploadZoneProps {
  folderSlug?: string;
  propertyId?: string;
  accept?: "image" | "video" | "all";
  onUploadComplete?: () => void;
  className?: string;
}

export function MediaUploadZone({
  folderSlug = "general",
  propertyId,
  accept = "all",
  onUploadComplete,
  className,
}: MediaUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { files, isUploading, addFiles, retry, remove, clearCompleted } = useMediaUpload({
    folderSlug,
    propertyId,
    onComplete: () => onUploadComplete?.(),
  });

  const acceptTypes =
    accept === "image"
      ? ACCEPTED_IMAGE_TYPES.join(",")
      : accept === "video"
        ? ACCEPTED_VIDEO_TYPES.join(",")
        : [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(",");

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return;
      const limited = Array.from(fileList).slice(0, MAX_BULK_UPLOAD_COUNT);
      void addFiles(limited);
    },
    [addFiles],
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div
        role="button"
        tabIndex={0}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/40",
        )}
      >
        <Upload className="mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">Dosyaları sürükleyip bırakın veya seçin</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Çoklu yükleme desteklenir (maks. {MAX_BULK_UPLOAD_COUNT} dosya)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptTypes}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Yükleme kuyruğu</p>
            <Button type="button" variant="ghost" size="sm" onClick={clearCompleted}>
              Tamamlananları temizle
            </Button>
          </div>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{file.file.name}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full transition-all",
                      file.status === "error" ? "bg-destructive" : "bg-primary",
                    )}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
                {file.error ? (
                  <p className="mt-1 text-xs text-destructive">{file.error}</p>
                ) : null}
              </div>
              {file.status === "error" ? (
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => retry(file.id)}>
                  <RefreshCw className="size-4" />
                </Button>
              ) : null}
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(file.id)}>
                <X className="size-4" />
              </Button>
            </div>
          ))}
          {isUploading ? (
            <p className="text-xs text-muted-foreground">Yükleniyor…</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
