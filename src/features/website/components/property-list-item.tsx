import Link from "next/link";
import { BedDouble, MapPin, Maximize2 } from "lucide-react";

import { PropertyImage } from "@/components/media";
import { routes } from "@/config/routes";
import type { PublicPropertyListItem } from "@/features/properties/types";
import {
  formatPropertyPriceValue,
  getListingTypeLabel,
  getPropertyKindLabel,
} from "@/features/properties/utils/property-formatters";

interface PropertyListItemProps {
  property: PublicPropertyListItem;
}

export function PropertyListItem({ property }: PropertyListItemProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md sm:flex-row">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted sm:aspect-auto sm:w-72">
        {property.primaryImageUrl ? (
          <PropertyImage
            src={property.primaryImageUrl}
            alt={property.title}
            publicId={property.primaryImagePublicId}
            fill
            sizes="288px"
            className="rounded-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Görsel yok
          </div>
        )}
        {property.isFeatured ? (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Öne Çıkan
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
              {getListingTypeLabel(property.listingType)}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5">
              {property.categoryName ?? getPropertyKindLabel(property.propertyKind)}
            </span>
          </div>
          <h3 className="font-heading text-xl font-semibold">
            <Link
              href={routes.public.propertyDetail(property.slug)}
              className="hover:text-primary"
            >
              {property.title}
            </Link>
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {[property.city, property.district].filter(Boolean).join(", ") || "Konum belirtilmemiş"}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
          <p className="font-heading text-2xl font-semibold">
            {formatPropertyPriceValue(property.price, property.currency)}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {property.roomCount ? (
              <span className="flex items-center gap-1">
                <BedDouble className="size-4" />
                {property.roomCount}
              </span>
            ) : null}
            {property.grossArea ? (
              <span className="flex items-center gap-1">
                <Maximize2 className="size-4" />
                {property.grossArea} m²
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
