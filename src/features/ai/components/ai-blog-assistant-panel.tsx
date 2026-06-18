"use client";

import { useFormContext } from "react-hook-form";

import type { BlogPostFormInput } from "@/features/blog/schemas";
import type { BlogLookupData } from "@/features/blog/types";

import { runBlogAssistantAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";
import { AiGenerateButton } from "./ai-generate-button";

interface AiBlogAssistantPanelProps {
  lookup: BlogLookupData;
}

export function AiBlogAssistantPanel({ lookup }: AiBlogAssistantPanelProps) {
  const form = useFormContext<BlogPostFormInput>();
  const { execute, retry, isLoading, error } = useAiAction(runBlogAssistantAction);

  const getContext = () => ({
    title: form.getValues("title"),
    excerpt: form.getValues("excerpt"),
    content: form.getValues("content"),
    categories: lookup.categories.map((c) => ({ id: c.id, name: c.name })),
  });

  const runMode = async (mode: "titles" | "meta" | "draft" | "category") => {
    const result = await execute({ mode, ...getContext() });
    if (!result?.success) return;

    if (result.data.titles?.[0]) {
      form.setValue("title", result.data.titles[0], { shouldDirty: true });
    }
    if (result.data.metaDescription) {
      form.setValue("metaDescription", result.data.metaDescription, { shouldDirty: true });
    }
    if (result.data.contentDraft) {
      form.setValue("content", result.data.contentDraft, { shouldDirty: true });
    }
    if (result.data.suggestedCategoryId) {
      form.setValue("categoryId", result.data.suggestedCategoryId, { shouldDirty: true });
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">Blog Asistanı</p>
        <p className="text-xs text-muted-foreground">
          Başlık, meta açıklama, içerik taslağı ve kategori önerileri.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <AiGenerateButton
          label="Başlık Öner"
          isLoading={isLoading}
          error={error}
          onGenerate={() => runMode("titles")}
          onRetry={retry}
        />
        <AiGenerateButton
          label="Meta Açıklama"
          isLoading={isLoading}
          onGenerate={() => runMode("meta")}
        />
        <AiGenerateButton
          label="İçerik Taslağı"
          isLoading={isLoading}
          onGenerate={() => runMode("draft")}
        />
        <AiGenerateButton
          label="Kategori Öner"
          isLoading={isLoading}
          onGenerate={() => runMode("category")}
        />
      </div>
    </div>
  );
}
