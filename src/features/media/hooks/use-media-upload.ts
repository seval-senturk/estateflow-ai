"use client";

import { useCallback, useState } from "react";

export interface UploadFileState {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  mediaId?: string;
}

interface UseMediaUploadOptions {
  folderSlug?: string;
  propertyId?: string;
  onComplete?: (mediaId: string) => void;
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const [files, setFiles] = useState<UploadFileState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (uploadState: UploadFileState) => {
      setFiles((current) =>
        current.map((item) =>
          item.id === uploadState.id
            ? { ...item, status: "uploading", progress: 10 }
            : item,
        ),
      );

      const formData = new FormData();
      formData.append("file", uploadState.file);
      formData.append("folderSlug", options.folderSlug ?? "general");
      if (options.propertyId) {
        formData.append("propertyId", options.propertyId);
      }

      try {
        const response = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error ?? "Yükleme başarısız");
        }

        setFiles((current) =>
          current.map((item) =>
            item.id === uploadState.id
              ? { ...item, status: "success", progress: 100, mediaId: result.data.id }
              : item,
          ),
        );

        options.onComplete?.(result.data.id);
      } catch (error) {
        setFiles((current) =>
          current.map((item) =>
            item.id === uploadState.id
              ? {
                  ...item,
                  status: "error",
                  progress: 0,
                  error: error instanceof Error ? error.message : "Yükleme hatası",
                }
              : item,
          ),
        );
      }
    },
    [options],
  );

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList).map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        file,
        progress: 0,
        status: "pending" as const,
      }));

      setFiles((current) => [...current, ...incoming]);
      setIsUploading(true);

      for (const item of incoming) {
        await uploadFile(item);
      }

      setIsUploading(false);
    },
    [uploadFile],
  );

  const retry = useCallback(
    async (id: string) => {
      const target = files.find((item) => item.id === id);
      if (!target) return;
      setIsUploading(true);
      await uploadFile({ ...target, status: "pending", progress: 0, error: undefined });
      setIsUploading(false);
    },
    [files, uploadFile],
  );

  const remove = useCallback((id: string) => {
    setFiles((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setFiles((current) => current.filter((item) => item.status !== "success"));
  }, []);

  return {
    files,
    isUploading,
    addFiles,
    retry,
    remove,
    clearCompleted,
  };
}
