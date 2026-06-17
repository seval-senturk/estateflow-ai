import type { Metadata } from "next";
import { Suspense } from "react";

import { seoConfig } from "@/config/seo";
import { PropertyCard } from "@/features/properties/components/property-card";
import { PublicPropertyPagination } from "@/features/properties/components/public-property-pagination";
import {
  PropertyActiveFilters,
  PropertyFiltersDrawer,
  PropertyFiltersPanel,
  PropertyMapViewLazy,
  PropertyResultsToolbar,
  PropertySearchBar,
  PropertySearchEmpty,
  PropertySortSelect,
} from "@/features/search/components";
import { countActiveFilters, getActiveFilterChips } from "@/features/search/lib/active-filters";
import { buildCanonicalSearchUrl } from "@/features/search/lib/build-search-url";
import {
  getViewMode,
  isMapViewEnabled,
  parsePublicPropertyFilters,
} from "@/features/search/lib/parse-search-params";
import { searchService } from "@/features/search/services/search.service";
import { PropertyListItem } from "@/features/website/components/property-list-item";
import { buildPropertyListJsonLd } from "@/features/website/lib/structured-data";

interface PublicPropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: PublicPropertiesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const filters = parsePublicPropertyFilters(params);
  const chips = getActiveFilterChips(filters);
  const hasFilters = chips.length > 0;
  const canonical = `${seoConfig.siteUrl}${buildCanonicalSearchUrl(filters)}`;

  const title = hasFilters ? "İlan Arama Sonuçları" : "İlanlar";
  const description = hasFilters
    ? `Filtrelenmiş emlak ilanları — ${chips.map((chip) => chip.label).join(", ")}`
    : "Satılık ve kiralık emlak ilanlarını keşfedin.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${seoConfig.defaultTitle}`,
      description,
      url: canonical,
    },
    alternates: { canonical },
    robots: hasFilters ? { index: true, follow: true } : undefined,
  };
}

export default async function PublicPropertiesPage({
  searchParams,
}: PublicPropertiesPageProps) {
  const params = await searchParams;
  const filters = parsePublicPropertyFilters(params);
  const view = getViewMode(params);
  const mapEnabled = isMapViewEnabled(params);
  const [result, options] = await Promise.all([
    searchService.search(filters),
    searchService.getFilterOptions(filters.city),
  ]);

  const featureLabels = Object.fromEntries(options.features.map((f) => [f.slug, f.name]));
  const activeCount = countActiveFilters(filters, featureLabels);
  const listJsonLd = buildPropertyListJsonLd(result.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">Portföy</p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Emlak İlanları
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Gelişmiş filtrelerle aradığınız mülkü hızlıca bulun.
            </p>
          </div>
          <PropertySearchBar
            defaultSearch={filters.search}
            defaultCity={filters.city}
            defaultDistrict={filters.district}
            compact
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <PropertyFiltersPanel
              filters={filters}
              options={options}
              view={view}
              mapEnabled={mapEnabled}
            />
          </aside>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PropertyFiltersDrawer
                filters={filters}
                options={options}
                view={view}
                mapEnabled={mapEnabled}
                activeCount={activeCount}
              />
              <Suspense fallback={null}>
                <PropertySortSelect filters={filters} view={view} mapEnabled={mapEnabled} />
              </Suspense>
            </div>

            <Suspense fallback={null}>
              <PropertyActiveFilters filters={filters} options={options} />
            </Suspense>

            {mapEnabled ? <PropertyMapViewLazy properties={result.items} /> : null}

            {result.items.length === 0 ? (
              <PropertySearchEmpty />
            ) : (
              <>
                <Suspense fallback={null}>
                  <PropertyResultsToolbar total={result.total} />
                </Suspense>

                {view === "list" ? (
                  <div className="space-y-4">
                    {result.items.map((property) => (
                      <PropertyListItem key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {result.items.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}

                {result.totalPages > 1 ? (
                  <div className="flex justify-center pt-4">
                    <PublicPropertyPagination
                      page={result.page}
                      totalPages={result.totalPages}
                      searchParams={params}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
