"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/shared";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/shared/drawer";
import type { PublicPropertyFilters } from "@/features/properties/types";
import type { PublicSearchFilterOptions } from "@/features/search/types";

import { PropertyFiltersForm } from "./property-filters-form";

interface PropertyFiltersDrawerProps {
  filters: PublicPropertyFilters;
  options: PublicSearchFilterOptions;
  view?: "grid" | "list";
  mapEnabled?: boolean;
  activeCount?: number;
}

export function PropertyFiltersDrawer({
  filters,
  options,
  view,
  mapEnabled,
  activeCount = 0,
}: PropertyFiltersDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" type="button" className="lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filtreler
          {activeCount > 0 ? (
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Filtreler</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-8">
          <PropertyFiltersForm
            filters={filters}
            options={options}
            view={view}
            mapEnabled={mapEnabled}
            onApplied={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
