"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Grid3x3, List } from "lucide-react";

import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

interface PropertyListingToolbarProps {
  total: number;
  className?: string;
}

export function PropertyListingToolbar({ total, className }: PropertyListingToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "list" ? "list" : "grid";

  const setView = (nextView: "grid" | "list") => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextView === "grid") {
      params.delete("view");
    } else {
      params.set("view", nextView);
    }
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{total}</span> ilan bulundu
      </p>
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
  );
}
