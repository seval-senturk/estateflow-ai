"use client";

import Link from "next/link";
import { X } from "lucide-react";

import type { PublicPropertyFilters } from "@/features/properties/types";
import { getActiveFilterChips } from "@/features/search/lib/active-filters";
import type { PublicSearchFilterOptions } from "@/features/search/types";

interface PropertyActiveFiltersProps {
  filters: PublicPropertyFilters;
  options: PublicSearchFilterOptions;
}

export function PropertyActiveFilters({ filters, options }: PropertyActiveFiltersProps) {
  const featureLabels = Object.fromEntries(options.features.map((f) => [f.slug, f.name]));
  const chips = getActiveFilterChips(filters, featureLabels);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Aktif filtreler">
      <span className="text-xs font-medium text-muted-foreground">Aktif:</span>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.removeUrl}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs hover:bg-muted"
        >
          {chip.label}
          <X className="size-3" aria-hidden />
          <span className="sr-only">Kaldır</span>
        </Link>
      ))}
    </div>
  );
}
