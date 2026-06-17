"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/shared";
import { routes } from "@/config/routes";

const QUICK_FILTERS = [
  { label: "Satılık", href: `${routes.public.properties}?listingType=FOR_SALE` },
  { label: "Kiralık", href: `${routes.public.properties}?listingType=FOR_RENT` },
  { label: "Villa", href: `${routes.public.properties}?kind=VILLA` },
  { label: "İstanbul", href: `${routes.public.properties}?city=İstanbul` },
];

interface PropertySearchHeroProps {
  compact?: boolean;
}

export function PropertySearchHero({ compact = false }: PropertySearchHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    const qs = params.toString();
    router.push(qs ? `${routes.public.properties}?${qs}` : routes.public.properties);
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Şehir, ilçe veya anahtar kelime ara…"
            className="h-11 w-full rounded-lg border border-border bg-background pr-4 pl-10 text-sm"
            aria-label="İlan ara"
          />
        </div>
        <Button type="submit" className="h-11 px-6">
          İlan Ara
        </Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => router.push(filter.href)}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
