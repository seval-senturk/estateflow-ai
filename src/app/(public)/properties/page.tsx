import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { routes } from "@/config/routes";
import { seoConfig } from "@/config/seo";
import { PropertyCard } from "@/features/properties/components/property-card";
import { PublicPropertyPagination } from "@/features/properties/components/public-property-pagination";
import { propertyService } from "@/features/properties/services";
import {
  PropertyListingToolbar,
  PropertyListItem,
  PropertySearchHero,
} from "@/features/website/components";
import { buildPropertyListJsonLd } from "@/features/website/lib/structured-data";
import { getViewMode, parsePublicPropertyFilters } from "@/features/website/lib/parse-filters";

interface PublicPropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "İlanlar",
  description: "Satılık ve kiralık emlak ilanlarını keşfedin.",
  openGraph: {
    title: `İlanlar | ${seoConfig.defaultTitle}`,
    description: "Güncel satılık ve kiralık emlak portföyü.",
    url: `${seoConfig.siteUrl}${routes.public.properties}`,
  },
  alternates: { canonical: `${seoConfig.siteUrl}${routes.public.properties}` },
};

export default async function PublicPropertiesPage({
  searchParams,
}: PublicPropertiesPageProps) {
  const params = await searchParams;
  const filters = parsePublicPropertyFilters(params);
  const view = getViewMode(params);
  const result = await propertyService.listPublished(filters);
  const listJsonLd = buildPropertyListJsonLd(result.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">Portföy</p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Emlak İlanları
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Güncel satılık ve kiralık ilanlarımızı inceleyin.
            </p>
          </div>
          <PropertySearchHero compact />
        </div>

        {result.items.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
            <h2 className="font-heading text-lg font-semibold">İlan bulunamadı</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Arama kriterlerinize uygun ilan bulunmuyor. Filtreleri değiştirmeyi deneyin.
            </p>
            <Link href={routes.public.properties} className="mt-4 text-sm font-medium text-primary">
              Tüm ilanları göster
            </Link>
          </div>
        ) : (
          <>
            <Suspense fallback={null}>
              <PropertyListingToolbar total={result.total} className="mb-6" />
            </Suspense>

            {view === "list" ? (
              <div className="space-y-4">
                {result.items.map((property) => (
                  <PropertyListItem key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {result.items.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {result.totalPages > 1 ? (
              <div className="mt-10 flex justify-center">
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
    </>
  );
}
