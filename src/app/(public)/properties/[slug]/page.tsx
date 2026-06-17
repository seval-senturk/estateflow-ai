import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { routes } from "@/config/routes";
import {
  formatPropertyPriceValue,
  getHeatingTypeLabel,
  getListingTypeLabel,
  getPropertyKindLabel,
} from "@/features/properties/utils/property-formatters";
import { propertyService } from "@/features/properties/services";

interface PublicPropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PublicPropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await propertyService.getPublishedBySlug(slug);

  if (!property) {
    return { title: "İlan Bulunamadı" };
  }

  return {
    title: property.metaTitle ?? property.title,
    description: property.metaDescription ?? property.shortDescription ?? undefined,
    openGraph: {
      title: property.metaTitle ?? property.title,
      description: property.metaDescription ?? property.shortDescription ?? undefined,
      images: property.ogImage ? [{ url: property.ogImage }] : undefined,
    },
    alternates: property.canonicalUrl
      ? { canonical: property.canonicalUrl }
      : { canonical: routes.public.propertyDetail(property.slug) },
  };
}

export default async function PublicPropertyDetailPage({
  params,
}: PublicPropertyDetailPageProps) {
  const { slug } = await params;
  const property = await propertyService.getPublishedBySlug(slug);

  if (!property) {
    notFound();
  }

  const activeFeatures = property.features.filter((feature) => feature.value === "true");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={routes.public.home} className="hover:text-foreground">
          Ana Sayfa
        </Link>
        <span className="mx-2">/</span>
        <Link href={routes.public.properties} className="hover:text-foreground">
          İlanlar
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{property.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
              <span className="text-sm text-muted-foreground">Görsel galerisi yakında</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                {getListingTypeLabel(property.listingType)}
              </span>
              <span className="rounded-full bg-muted px-3 py-1">
                {getPropertyKindLabel(property.propertyKind)}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {property.title}
            </h1>
            <p className="text-muted-foreground">
              {[property.city, property.district, property.neighborhood]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          {property.description ? (
            <section className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">Açıklama</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </section>
          ) : null}

          <section className="space-y-4">
            <h2 className="font-heading text-xl font-semibold">Özellikler</h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.roomCount ? (
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs text-muted-foreground">Oda</dt>
                  <dd className="mt-1 font-medium">{property.roomCount}</dd>
                </div>
              ) : null}
              {property.grossArea ? (
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs text-muted-foreground">Brüt Alan</dt>
                  <dd className="mt-1 font-medium">{property.grossArea} m²</dd>
                </div>
              ) : null}
              {property.netArea ? (
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs text-muted-foreground">Net Alan</dt>
                  <dd className="mt-1 font-medium">{property.netArea} m²</dd>
                </div>
              ) : null}
              {property.bathroomCount != null ? (
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs text-muted-foreground">Banyo</dt>
                  <dd className="mt-1 font-medium">{property.bathroomCount}</dd>
                </div>
              ) : null}
              {property.heatingType ? (
                <div className="rounded-lg border border-border p-4">
                  <dt className="text-xs text-muted-foreground">Isıtma</dt>
                  <dd className="mt-1 font-medium">
                    {getHeatingTypeLabel(property.heatingType)}
                  </dd>
                </div>
              ) : null}
            </dl>

            {activeFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeFeatures.map((feature) => (
                  <span
                    key={feature.name}
                    className="rounded-full border border-border bg-card px-3 py-1 text-sm"
                  >
                    {feature.name}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Fiyat</p>
            <p className="mt-1 font-heading text-3xl font-semibold">
              {formatPropertyPriceValue(property.price, property.currency)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {getListingTypeLabel(property.listingType)}
            </p>
            <Link
              href={routes.public.contact}
              className="mt-6 flex h-11 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
            >
              İletişime Geç
            </Link>
          </div>

          {property.address ? (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold">Adres</h3>
              <p className="mt-2 text-sm text-muted-foreground">{property.address}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
