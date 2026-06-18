"use client";

import dynamic from "next/dynamic";

import { LoadingState } from "@/components/admin/ui/loading-state";

export const LeadKanbanBoardLazy = dynamic(
  () => import("./lead-kanban-board").then((mod) => mod.LeadKanbanBoard),
  {
    loading: () => <LoadingState label="Kanban yükleniyor…" />,
  },
);
