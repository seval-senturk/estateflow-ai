import type { PublicPropertyFilters } from "@/features/properties/types";
import type { PublicSearchFilterOptions } from "@/features/search/types";

import { PropertyFiltersForm } from "./property-filters-form";

interface PropertyFiltersPanelProps {
  filters: PublicPropertyFilters;
  options: PublicSearchFilterOptions;
  view?: "grid" | "list";
  mapEnabled?: boolean;
}

export function PropertyFiltersPanel({ filters, options, view, mapEnabled }: PropertyFiltersPanelProps) {
  return (
    <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
      <h2 className="mb-5 font-heading text-lg font-semibold">Filtreler</h2>
      <PropertyFiltersForm
        filters={filters}
        options={options}
        view={view}
        mapEnabled={mapEnabled}
      />
    </div>
  );
}
