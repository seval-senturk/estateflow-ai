"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { Button, Input } from "@/components/shared";
import type { PublicPropertyFilters } from "@/features/properties/types";
import {
  CURRENCY_OPTIONS,
  FEATURED_FILTER_SLUGS,
  LISTING_TYPE_OPTIONS,
  PROPERTY_KIND_OPTIONS,
  ROOM_COUNT_OPTIONS,
} from "@/features/search/constants";
import { buildSearchUrl } from "@/features/search/lib/build-search-url";
import { searchAnalytics } from "@/features/search/lib/search-analytics";
import type { PublicSearchFilterOptions } from "@/features/search/types";

interface PropertyFiltersFormProps {
  filters: PublicPropertyFilters;
  options: PublicSearchFilterOptions;
  view?: "grid" | "list";
  mapEnabled?: boolean;
  onApplied?: () => void;
  className?: string;
}

export function PropertyFiltersForm({
  filters,
  options,
  view,
  mapEnabled,
  onApplied,
  className,
}: PropertyFiltersFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<PublicPropertyFilters>(filters);
  const cityListId = useId();
  const districtListId = useId();

  const featuredFeatures = options.features.filter((feature) =>
    FEATURED_FILTER_SLUGS.includes(feature.slug as (typeof FEATURED_FILTER_SLUGS)[number]),
  );

  const updateDraft = (patch: Partial<PublicPropertyFilters>) => {
    setDraft((current) => ({ ...current, ...patch, page: 1 }));
  };

  const toggleFeature = (slug: string) => {
    const current = draft.features ?? [];
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    updateDraft({ features: next.length > 0 ? next : undefined });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const url = buildSearchUrl(draft, { view, map: mapEnabled });
    searchAnalytics.trackFilterApply(draft);
    startTransition(() => {
      router.push(url);
      onApplied?.();
    });
  };

  const handleReset = () => {
    const url = buildSearchUrl({}, { view, map: mapEnabled });
    startTransition(() => {
      router.push(url);
      onApplied?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        <FilterSection title="Lokasyon">
          <Field label="Şehir">
            <Input
              list={cityListId}
              value={draft.city ?? ""}
              onChange={(event) => updateDraft({ city: event.target.value || undefined })}
              placeholder="Örn. İstanbul"
            />
            <datalist id={cityListId}>
              {options.cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </Field>
          <Field label="İlçe">
            <Input
              list={districtListId}
              value={draft.district ?? ""}
              onChange={(event) => updateDraft({ district: event.target.value || undefined })}
              placeholder="Örn. Kadıköy"
            />
            <datalist id={districtListId}>
              {options.districts.map((district) => (
                <option key={district} value={district} />
              ))}
            </datalist>
          </Field>
          <Field label="Mahalle">
            <Input
              value={draft.neighborhood ?? ""}
              onChange={(event) => updateDraft({ neighborhood: event.target.value || undefined })}
              placeholder="Mahalle"
            />
          </Field>
        </FilterSection>

        <FilterSection title="İlan Tipi">
          <div className="flex flex-wrap gap-2">
            {LISTING_TYPE_OPTIONS.map((option) => (
              <ToggleChip
                key={option.value}
                active={draft.listingType === option.value}
                onClick={() =>
                  updateDraft({
                    listingType: draft.listingType === option.value ? undefined : option.value,
                  })
                }
              >
                {option.label}
              </ToggleChip>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Kategori">
          <div className="flex flex-wrap gap-2">
            {options.categories.map((category) => (
              <ToggleChip
                key={category.slug}
                active={draft.categorySlug === category.slug}
                onClick={() =>
                  updateDraft({
                    categorySlug:
                      draft.categorySlug === category.slug ? undefined : category.slug,
                    propertyKind: undefined,
                  })
                }
              >
                {category.name}
              </ToggleChip>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Emlak Türü">
          <div className="flex flex-wrap gap-2">
            {PROPERTY_KIND_OPTIONS.map((option) => (
              <ToggleChip
                key={option.value}
                active={draft.propertyKind === option.value}
                onClick={() =>
                  updateDraft({
                    propertyKind:
                      draft.propertyKind === option.value ? undefined : option.value,
                  })
                }
              >
                {option.label}
              </ToggleChip>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Fiyat">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Min">
              <Input
                type="number"
                min={0}
                value={draft.minPrice ?? ""}
                onChange={(event) =>
                  updateDraft({
                    minPrice: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
                placeholder="0"
              />
            </Field>
            <Field label="Max">
              <Input
                type="number"
                min={0}
                value={draft.maxPrice ?? ""}
                onChange={(event) =>
                  updateDraft({
                    maxPrice: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
                placeholder="∞"
              />
            </Field>
          </div>
          <Field label="Para Birimi">
            <select
              value={draft.currency ?? ""}
              onChange={(event) =>
                updateDraft({ currency: (event.target.value || undefined) as PublicPropertyFilters["currency"] })
              }
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Tümü</option>
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </FilterSection>

        <FilterSection title="Detaylar">
          <Field label="Oda Sayısı">
            <div className="flex flex-wrap gap-2">
              {ROOM_COUNT_OPTIONS.map((room) => (
                <ToggleChip
                  key={room}
                  active={draft.roomCount === room}
                  onClick={() =>
                    updateDraft({ roomCount: draft.roomCount === room ? undefined : room })
                  }
                >
                  {room}
                </ToggleChip>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Min m²">
              <Input
                type="number"
                min={0}
                value={draft.minGrossArea ?? ""}
                onChange={(event) =>
                  updateDraft({
                    minGrossArea: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
            </Field>
            <Field label="Max m²">
              <Input
                type="number"
                min={0}
                value={draft.maxGrossArea ?? ""}
                onChange={(event) =>
                  updateDraft({
                    maxGrossArea: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Min Banyo">
              <Input
                type="number"
                min={0}
                value={draft.minBathrooms ?? ""}
                onChange={(event) =>
                  updateDraft({
                    minBathrooms: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
            </Field>
            <Field label="Max Bina Yaşı">
              <Input
                type="number"
                min={0}
                value={draft.maxBuildingAge ?? ""}
                onChange={(event) =>
                  updateDraft({
                    maxBuildingAge: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
            </Field>
          </div>
        </FilterSection>

        {featuredFeatures.length > 0 ? (
          <FilterSection title="Özellikler">
            <div className="flex flex-wrap gap-2">
              {featuredFeatures.map((feature) => (
                <ToggleChip
                  key={feature.slug}
                  active={draft.features?.includes(feature.slug) ?? false}
                  onClick={() => toggleFeature(feature.slug)}
                >
                  {feature.name}
                </ToggleChip>
              ))}
            </div>
          </FilterSection>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Uygulanıyor…" : "Filtreleri Uygula"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={handleReset} className="w-full">
          Filtreleri Sıfırla
        </Button>
      </div>
    </form>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          : "rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}
