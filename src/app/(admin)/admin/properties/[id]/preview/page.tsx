import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, Button } from "@/components/shared";
import { routes } from "@/config/routes";
import { PropertyCard } from "@/features/properties/components";
import { propertyService } from "@/features/properties/services";
import { enforcePermission } from "@/lib/authorization/guards";
import { permissions } from "@/config/permissions";
import {
  formatPropertyDate,
  formatPropertyPriceValue,
  getListingTypeLabel,
  getPropertyKindLabel,
} from "@/features/properties/utils/property-formatters";

interface PropertyPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPreviewPage({ params }: PropertyPreviewPageProps) {
  await enforcePermission(permissions.properties.read);
  const { id } = await params;

  const propertyResult = await propertyService.getById(id);
  if (!propertyResult.success) {
    notFound();
  }

  const property = propertyResult.data;
  const publicItem = {
    id: property.id,
    title: property.title,
    slug: property.slug,
    shortDescription: property.shortDescription ?? null,
    price: property.price,
    currency: property.currency,
    listingType: property.listingType,
    propertyKind: property.propertyKind,
    city: property.city,
    district: property.district ?? null,
    roomCount: property.roomCount ?? null,
    grossArea: property.grossArea ?? null,
    isFeatured: property.isFeatured,
    publishedAt: property.publishedAt ? new Date(property.publishedAt) : null,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="İlan Önizleme"
        description="Public sitede nasıl görüneceğinin admin önizlemesi."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "İlanlar", href: routes.admin.properties },
          { label: property.title, href: routes.admin.propertyDetail(id) },
          { label: "Önizleme" },
        ]}
        actions={
          <Button variant="outline" render={<Link href={routes.admin.propertyDetail(id)} />}>
            Detaya Dön
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        <PropertyCard property={publicItem} />

        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Önizleme Bilgisi
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold">{property.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {getListingTypeLabel(property.listingType)} · {getPropertyKindLabel(property.propertyKind)}
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Fiyat</dt>
              <dd className="font-semibold">
                {formatPropertyPriceValue(property.price, property.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Konum</dt>
              <dd>
                {[property.city, property.district, property.neighborhood]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Yayın Durumu</dt>
              <dd>{property.isPublished ? "Yayında" : "Yayında değil"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Yayın Tarihi</dt>
              <dd>
                {property.publishedAt
                  ? formatPropertyDate(property.publishedAt)
                  : "Belirlenmedi"}
              </dd>
            </div>
          </dl>

          {property.shortDescription ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {property.shortDescription}
            </p>
          ) : null}

          {property.description ? (
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap">{property.description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
