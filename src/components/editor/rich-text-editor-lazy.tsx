"use client";

import dynamic from "next/dynamic";

import { LoadingState } from "@/components/admin/ui/loading-state";

export const RichTextEditorLazy = dynamic(
  () => import("@/components/editor/rich-text-editor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <LoadingState label="Editör yükleniyor…" />,
  },
);
