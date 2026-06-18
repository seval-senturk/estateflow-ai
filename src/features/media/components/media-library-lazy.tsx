"use client";

import dynamic from "next/dynamic";

import { LoadingState } from "@/components/admin/ui/loading-state";

export const MediaLibraryLazy = dynamic(
  () => import("./media-library").then((mod) => mod.MediaLibrary),
  {
    loading: () => <LoadingState label="Medya kütüphanesi yükleniyor…" />,
  },
);
