"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { generateLeadSummaryAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";
import { AiGenerateButton } from "./ai-generate-button";

interface AiLeadSummaryCardProps {
  leadId: string;
}

export function AiLeadSummaryCard({ leadId }: AiLeadSummaryCardProps) {
  const { execute, retry, isLoading, error, data } = useAiAction(generateLeadSummaryAction);
  const [expanded, setExpanded] = useState(false);

  const handleGenerate = async () => {
    const result = await execute({ leadId });
    if (result?.success) setExpanded(true);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Lead Özeti</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Lead geçmişini analiz ederek eyleme dönük özet oluşturur.
      </p>
      <AiGenerateButton
        label="Özet Oluştur"
        loadingLabel="Özet oluşturuluyor…"
        isLoading={isLoading}
        error={error}
        onGenerate={handleGenerate}
        onRetry={retry}
      />
      {expanded && data?.summary ? (
        <div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-line">{data.summary}</div>
      ) : null}
    </div>
  );
}
