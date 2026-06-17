import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/config/routes";
import { PropertyCard } from "@/features/properties/components/property-card";
import { PublicPropertyPagination } from "@/features/properties/components/public-property-pagination";
import { propertyService } from "@/features/properties/services";

interface PublicPropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "İlanlar",
  description: "Satılık ve kiralık emlak ilanlarını keşfedin.",
};

function getPageParam(
  params: Record<string, string | string[] | undefined>,
): number {
  const value = params.page;
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? "1");
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function PublicPropertiesPage({
  searchParams,
}: PublicPropertiesPageProps) {
  const params = await searchParams;
  const page = getPageParam(params);
  const result = await propertyService.listPublished(page, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          Portföy
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Emlak İlanları
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Güncel satılık ve kiralık ilanlarımızı inceleyin. Detay sayfasından
          özellikler ve konum bilgilerine ulaşabilirsiniz.
        </p>
      </div>

      {result.items.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
          <h2 className="font-heading text-lg font-semibold">Henüz yayınlanmış ilan yok</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Yeni ilanlar eklendiğinde burada listelenecektir.
          </p>
          <Link href={routes.public.home} className="mt-4 text-sm font-medium text-primary">
            Ana sayfaya dön
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {result.totalPages > 1 ? (
            <div className="mt-10 flex justify-center">
              <PublicPropertyPagination page={result.page} totalPages={result.totalPages} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
