"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { generatePublicPropertySummaryAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";
import { AiGenerateButton } from "./ai-generate-button";

interface AiPropertySummaryProps {
  description: string;
  title: string;
}

export function AiPropertySummary({ description, title }: AiPropertySummaryProps) {
  const { execute, retry, isLoading, error, data } = useAiAction(generatePublicPropertySummaryAction);
  const [visible, setVisible] = useState(false);

  if (!description || description.length < 50) return null;

  const handleGenerate = async () => {
    const result = await execute({ description, title });
    if (result?.success) setVisible(true);
  };

  return (
    <section className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-lg font-semibold">Bu İlanın Kısa Özeti</h2>
      </div>
      {!visible ? (
        <AiGenerateButton
          label="AI Özeti Göster"
          loadingLabel="Özet oluşturuluyor…"
          isLoading={isLoading}
          error={error}
          onGenerate={handleGenerate}
          onRetry={retry}
          size="default"
        />
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">{data?.summary}</p>
      )}
    </section>
  );
}
