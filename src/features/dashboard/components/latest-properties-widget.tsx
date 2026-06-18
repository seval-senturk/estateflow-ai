import Link from "next/link";

import { DataCard } from "@/components/admin/ui/data-card";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { routes } from "@/config/routes";
import type { LatestPropertySummary } from "../types";
import { formatPropertyPriceValue } from "@/features/properties/utils/property-formatters";

interface LatestPropertiesWidgetProps {
  properties: LatestPropertySummary[];
}

export function LatestPropertiesWidget({ properties }: LatestPropertiesWidgetProps) {
  return (
    <DataCard
      title="Son İlanlar"
      description="En son eklenen ilan kayıtları"
      footer={
        <Link href={routes.admin.properties} className="text-primary hover:underline">
          Tüm ilanlar →
        </Link>
      }
    >
      {properties.length === 0 ? (
        <EmptyState title="Henüz ilan yok" description="Yeni ilanlar burada listelenecek." />
      ) : (
        <ul className="space-y-3">
          {properties.map((property) => (
            <li key={property.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <Link
                  href={routes.admin.propertyDetail(property.id)}
                  className="font-medium hover:text-primary"
                >
                  {property.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {property.isPublished ? "Yayında" : "Taslak"}
                </p>
              </div>
              <span className="shrink-0 text-muted-foreground">
                {formatPropertyPriceValue(property.price, property.currency as never)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DataCard>
  );
}
