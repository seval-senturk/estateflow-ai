"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import type { PublicPropertyFilters } from "@/features/properties/types";
import { SORT_OPTIONS } from "@/features/search/constants";
import { buildSearchUrl } from "@/features/search/lib/build-search-url";
import { parsePublicPropertyFilters } from "@/features/search/lib/parse-search-params";
import { searchAnalytics } from "@/features/search/lib/search-analytics";

interface PropertySortSelectProps {
  filters: PublicPropertyFilters;
  view?: "grid" | "list";
  mapEnabled?: boolean;
}

function getCurrentSortValue(filters: PublicPropertyFilters): string {
  const match = SORT_OPTIONS.find(
    (option) => option.sortBy === filters.sortBy && option.sortOrder === filters.sortOrder,
  );
  return match?.value ?? "newest";
}

export function PropertySortSelect({ filters, view, mapEnabled }: PropertySortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const current = getCurrentSortValue(filters);

  const handleChange = (value: string) => {
    const preset = SORT_OPTIONS.find((option) => option.value === value);
    if (!preset) return;

    const params = Object.fromEntries(searchParams.entries());
    const current = parsePublicPropertyFilters(params);
    const next: PublicPropertyFilters = {
      ...current,
      sortBy: preset.sortBy,
      sortOrder: preset.sortOrder,
      page: 1,
    };

    searchAnalytics.trackSortChange(next);
    startTransition(() => {
      router.push(buildSearchUrl(next, { view, map: mapEnabled }));
    });
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Sırala</span>
      <select
        value={current}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value)}
        className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
        aria-label="Sıralama seçin"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
