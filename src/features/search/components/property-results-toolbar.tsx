"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Grid3x3, List, Map } from "lucide-react";

import { Button } from "@/components/shared";
import { searchAnalytics } from "@/features/search/lib/search-analytics";
import { cn } from "@/lib/utils";

interface PropertyResultsToolbarProps {
  total: number;
  className?: string;
}

export function PropertyResultsToolbar({ total, className }: PropertyResultsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const mapEnabled = searchParams.get("map") === "1";

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  };

  const setView = (nextView: "grid" | "list") => {
    updateParams((params) => {
      if (nextView === "grid") params.delete("view");
      else params.set("view", nextView);
    });
  };

  const toggleMap = () => {
    const next = !mapEnabled;
    searchAnalytics.trackMapToggle();
    updateParams((params) => {
      if (next) params.set("map", "1");
      else params.delete("map");
    });
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{total}</span> ilan bulundu
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={mapEnabled ? "secondary" : "outline"}
          size="sm"
          onClick={toggleMap}
          aria-pressed={mapEnabled}
        >
          <Map className="size-4" />
          Harita
        </Button>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <Button
            type="button"
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Izgara görünümü"
            onClick={() => setView("grid")}
          >
            <Grid3x3 className="size-4" />
          </Button>
          <Button
            type="button"
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Liste görünümü"
            onClick={() => setView("list")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
