import Link from "next/link";

import { PropertyCard } from "@/features/properties/components/property-card";
import type { PublicPropertyListItem } from "@/features/properties/types";
import { routes } from "@/config/routes";
import { Button } from "@/components/shared";

interface PropertyShowcaseProps {
  title: string;
  description: string;
  properties: PublicPropertyListItem[];
  viewAllHref?: string;
}

export function PropertyShowcase({
  title,
  description,
  properties,
  viewAllHref = routes.public.properties,
}: PropertyShowcaseProps) {
  if (properties.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" render={<Link href={viewAllHref} />}>
          Tümünü Gör
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
