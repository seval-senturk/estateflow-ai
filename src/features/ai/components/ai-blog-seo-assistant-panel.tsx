"use client";

import { useFormContext } from "react-hook-form";

import type { BlogPostFormInput } from "@/features/blog/schemas";

import { generateSeoContentAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";
import { AiGenerateButton } from "./ai-generate-button";

export function AiBlogSeoAssistantPanel() {
  const form = useFormContext<BlogPostFormInput>();
  const { execute, retry, isLoading, error } = useAiAction(generateSeoContentAction);

  const handleGenerate = async () => {
    const values = form.getValues();
    const result = await execute({
      entityType: "blog",
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
    });

    if (result?.success) {
      form.setValue("metaTitle", result.data.metaTitle, { shouldDirty: true });
      form.setValue("metaDescription", result.data.metaDescription, { shouldDirty: true });
      form.setValue("metaKeywords", result.data.metaKeywords, { shouldDirty: true });
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
      <div className="mb-2">
        <p className="text-sm font-medium">SEO Asistanı</p>
        <p className="text-xs text-muted-foreground">
          Blog yazısı için meta title, description ve anahtar kelimeleri oluşturun.
        </p>
      </div>
      <AiGenerateButton
        label="SEO İçeriği Oluştur"
        loadingLabel="SEO içeriği oluşturuluyor…"
        isLoading={isLoading}
        error={error}
        onGenerate={handleGenerate}
        onRetry={retry}
      />
    </div>
  );
}
