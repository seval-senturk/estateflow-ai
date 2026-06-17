import Link from "next/link";

import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

import type { PublicPropertyListItem } from "../types";
import {
  formatPropertyPriceValue,
  getListingTypeLabel,
  getPropertyKindLabel,
} from "../utils/property-formatters";

interface PropertyCardProps {
  property: PublicPropertyListItem;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <span className="text-sm text-muted-foreground">Görsel yakında</span>
        </div>
        {property.isFeatured ? (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Öne Çıkan
          </span>
        ) : null}
        <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium">
          {getListingTypeLabel(property.listingType)}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            {getPropertyKindLabel(property.propertyKind)}
          </p>
          <h3 className="font-heading text-lg font-semibold leading-snug">
            <Link
              href={routes.public.propertyDetail(property.slug)}
              className="hover:text-primary"
            >
              {property.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            {[property.city, property.district].filter(Boolean).join(", ") || "Konum belirtilmemiş"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <p className="font-heading text-xl font-semibold">
            {formatPropertyPriceValue(property.price, property.currency)}
          </p>
          <div className="text-right text-xs text-muted-foreground">
            {property.roomCount ? <p>{property.roomCount}</p> : null}
            {property.grossArea ? <p>{property.grossArea} m²</p> : null}
          </div>
        </div>
      </div>
    </article>
  );
}
