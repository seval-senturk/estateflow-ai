import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/shared";
import { PublicPropertyGallery } from "@/features/media/components";
import { routes } from "@/config/routes";
import {
  formatPropertyPriceValue,
  getHeatingTypeLabel,
  getListingTypeLabel,
  getPropertyKindLabel,
} from "@/features/properties/utils/property-formatters";
import { propertyService } from "@/features/properties/services";
import {
  PropertyDetailSidebar,
  PropertyMap,
  PropertyShowcase,
} from "@/features/website/components";
import {
  buildBreadcrumbListJsonLd,
  buildPropertyJsonLd,
} from "@/features/website/lib/structured-data";
import { buildPageMetadata } from "@/lib/seo";
import { propertyDetailBreadcrumb } from "@/lib/seo/breadcrumbs";

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

  return buildPageMetadata({
    title: property.metaTitle ?? property.title,
    description: property.metaDescription ?? property.shortDescription ?? undefined,
    keywords: property.metaKeywords,
    canonicalPath: routes.public.propertyDetail(property.slug),
    canonicalUrl: property.canonicalUrl,
    ogImage:
      property.ogImage ??
      property.primaryImageUrl ??
      property.gallery.images[0]?.url,
  });
}

export default async function PublicPropertyDetailPage({
  params,
}: PublicPropertyDetailPageProps) {
  const { slug } = await params;
  const property = await propertyService.getPublishedBySlug(slug);

  if (!property) {
    notFound();
  }

  const related = await propertyService.getRelatedProperties(property.id, property.city);
  const activeFeatures = property.features.filter((feature) => feature.value === "true");
  const propertyJsonLd = buildPropertyJsonLd(property);
  const breadcrumbs = propertyDetailBreadcrumb(property.title, property.slug);
  const breadcrumbJsonLd = buildBreadcrumbListJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-10">
            <PublicPropertyGallery
              images={property.gallery.images}
              videos={property.gallery.videos}
              title={property.title}
            />

            <header className="space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {getListingTypeLabel(property.listingType)}
                </span>
                <span className="rounded-full bg-muted px-3 py-1">
                  {property.categoryName ?? getPropertyKindLabel(property.propertyKind)}
                </span>
                {property.isFeatured ? (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-700">
                    Öne Çıkan
                  </span>
                ) : null}
              </div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {property.title}
              </h1>
              <p className="text-muted-foreground">
                {[property.city, property.district, property.neighborhood]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="font-heading text-2xl font-semibold lg:hidden">
                {formatPropertyPriceValue(property.price, property.currency)}
              </p>
            </header>

            <section className="grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
              {property.roomCount ? (
                <div>
                  <p className="text-xs text-muted-foreground">Oda</p>
                  <p className="mt-1 font-medium">{property.roomCount}</p>
                </div>
              ) : null}
              {property.grossArea ? (
                <div>
                  <p className="text-xs text-muted-foreground">Brüt Alan</p>
                  <p className="mt-1 font-medium">{property.grossArea} m²</p>
                </div>
              ) : null}
              {property.netArea ? (
                <div>
                  <p className="text-xs text-muted-foreground">Net Alan</p>
                  <p className="mt-1 font-medium">{property.netArea} m²</p>
                </div>
              ) : null}
              {property.bathroomCount != null ? (
                <div>
                  <p className="text-xs text-muted-foreground">Banyo</p>
                  <p className="mt-1 font-medium">{property.bathroomCount}</p>
                </div>
              ) : null}
            </section>

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
                {property.heatingType ? (
                  <div className="rounded-lg border border-border p-4">
                    <dt className="text-xs text-muted-foreground">Isıtma</dt>
                    <dd className="mt-1 font-medium">
                      {getHeatingTypeLabel(property.heatingType)}
                    </dd>
                  </div>
                ) : null}
                {property.buildingAge != null ? (
                  <div className="rounded-lg border border-border p-4">
                    <dt className="text-xs text-muted-foreground">Bina Yaşı</dt>
                    <dd className="mt-1 font-medium">{property.buildingAge} yıl</dd>
                  </div>
                ) : null}
                {property.floor != null ? (
                  <div className="rounded-lg border border-border p-4">
                    <dt className="text-xs text-muted-foreground">Kat</dt>
                    <dd className="mt-1 font-medium">{property.floor}</dd>
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

            {property.latitude != null && property.longitude != null ? (
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                title={property.title}
              />
            ) : null}
          </div>

          <PropertyDetailSidebar property={property} />
        </div>

        {related.length > 0 ? (
          <div className="mt-16 border-t border-border pt-16">
            <PropertyShowcase
              title="Benzer İlanlar"
              description="Aynı bölgedeki diğer ilanları inceleyin."
              properties={related}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
