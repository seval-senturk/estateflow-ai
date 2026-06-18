"use client";

import { analyzeContentAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";
import type { ContentImprovementInput } from "../schemas/ai.schema";
import type { ContentImprovementResult } from "../types";
import { AiGenerateButton } from "./ai-generate-button";

interface AiContentImprovementPanelProps {
  getInput: () => ContentImprovementInput;
}

export function AiContentImprovementPanel({ getInput }: AiContentImprovementPanelProps) {
  const { execute, retry, isLoading, error, data } = useAiAction(analyzeContentAction);

  const handleAnalyze = async () => {
    await execute(getInput());
  };

  return (
    <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">İçerik İyileştirme</p>
        <p className="text-xs text-muted-foreground">
          Eksik alanları, SEO ve içerik kalitesi önerilerini analiz edin.
        </p>
      </div>
      <AiGenerateButton
        label="İçeriği Analiz Et"
        loadingLabel="Analiz ediliyor…"
        isLoading={isLoading}
        error={error}
        onGenerate={handleAnalyze}
        onRetry={retry}
      />
      {data ? <ContentImprovementResults data={data} /> : null}
    </div>
  );
}

function ContentImprovementResults({ data }: { data: ContentImprovementResult }) {
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Kalite Skoru: {data.score}/100</p>
      {data.missingFields.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-muted-foreground">Eksik Alanlar</p>
          <ul className="list-disc pl-4 text-xs">
            {data.missingFields.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {data.seoSuggestions.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-muted-foreground">SEO Önerileri</p>
          <ul className="list-disc pl-4 text-xs">
            {data.seoSuggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {data.qualitySuggestions.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-muted-foreground">Kalite Önerileri</p>
          <ul className="list-disc pl-4 text-xs">
            {data.qualitySuggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
