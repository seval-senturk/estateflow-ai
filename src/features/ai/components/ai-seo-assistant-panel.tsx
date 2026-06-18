"use client";

import { useFormContext } from "react-hook-form";

import type { PropertyFormInput } from "@/features/properties/schemas";

import { generateSeoContentAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";
import { AiGenerateButton } from "./ai-generate-button";

interface AiSeoAssistantPanelProps {
  entityType: "property" | "blog";
}

export function AiSeoAssistantPanel({ entityType }: AiSeoAssistantPanelProps) {
  const form = useFormContext<PropertyFormInput>();
  const { execute, retry, isLoading, error } = useAiAction(generateSeoContentAction);

  const handleGenerate = async () => {
    const values = form.getValues();
    const result = await execute({
      entityType,
      title: values.title,
      excerpt: values.shortDescription,
      content: values.description,
      city: values.city,
      district: values.district,
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
          Meta title, description ve anahtar kelimeleri AI ile oluşturun.
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
