"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button, Input } from "@/components/shared";
import { buildSearchUrl } from "@/features/search/lib/build-search-url";

import { parsePublicSmartSearchAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";

export function AiSmartSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const { execute, retry, isLoading, error } = useAiAction(parsePublicSmartSearchAction);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;

    const result = await execute({ query: query.trim() });
    if (!result?.success) return;

    setInterpretation(result.data.interpretation);

    router.push(
      buildSearchUrl({
        search: result.data.search,
        city: result.data.city,
        district: result.data.district,
        neighborhood: result.data.neighborhood,
        listingType: result.data.listingType as never,
        propertyKind: result.data.propertyKind as never,
        roomCount: result.data.roomCount,
        features: result.data.features,
        page: 1,
      }),
    );
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={'Örn. "Nilüfer\'de metroya yakın 3+1 evler"'}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isLoading || query.trim().length < 3}>
          {isLoading ? "Analiz…" : "Akıllı Ara"}
        </Button>
        {error ? (
          <Button type="button" variant="outline" onClick={() => void retry()}>
            Tekrar
          </Button>
        ) : null}
      </div>
      {interpretation ? (
        <p className="text-xs text-muted-foreground">Yorum: {interpretation}</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </form>
  );
}
