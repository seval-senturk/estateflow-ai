"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

import { Button, Input } from "@/components/shared";
import { buildSearchUrl } from "@/features/search/lib/build-search-url";
import { searchAnalytics } from "@/features/search/lib/search-analytics";

interface PropertySearchBarProps {
  defaultSearch?: string;
  defaultCity?: string;
  defaultDistrict?: string;
  compact?: boolean;
}

export function PropertySearchBar({
  defaultSearch = "",
  defaultCity = "",
  defaultDistrict = "",
  compact = false,
}: PropertySearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultSearch);
  const [city, setCity] = useState(defaultCity);
  const [district, setDistrict] = useState(defaultDistrict);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const filters = {
      search: search.trim() || undefined,
      city: city.trim() || undefined,
      district: district.trim() || undefined,
      page: 1,
    };
    searchAnalytics.trackSearch(filters, 0);
    router.push(buildSearchUrl(filters));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-3" : "space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5"}
    >
      <div className={`grid gap-2 ${compact ? "sm:grid-cols-[1fr_auto]" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        <div className="relative sm:col-span-2">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Anahtar kelime, proje veya konum"
            className="pl-10"
            aria-label="İlan ara"
          />
        </div>
        {!compact ? (
          <>
            <Input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Şehir"
              aria-label="Şehir"
            />
            <Input
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              placeholder="İlçe"
              aria-label="İlçe"
            />
          </>
        ) : null}
        <Button type="submit" className={compact ? "h-9" : "h-9 sm:col-span-2 lg:col-span-1"}>
          İlan Ara
        </Button>
      </div>
      {!compact ? (
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Satılık", href: buildSearchUrl({ listingType: "FOR_SALE" }) },
            { label: "Kiralık", href: buildSearchUrl({ listingType: "FOR_RENT" }) },
            { label: "Villa", href: buildSearchUrl({ propertyKind: "VILLA" }) },
            { label: "İstanbul", href: buildSearchUrl({ city: "İstanbul" }) },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.href)}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
