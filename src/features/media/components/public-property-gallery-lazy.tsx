"use client";

import dynamic from "next/dynamic";

import { LoadingState } from "@/components/admin/ui/loading-state";

export const PublicPropertyGalleryLazy = dynamic(
  () => import("./public-property-gallery").then((mod) => mod.PublicPropertyGallery),
  {
    loading: () => <LoadingState label="Galeri yükleniyor…" />,
  },
);
