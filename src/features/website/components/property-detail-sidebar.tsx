import Link from "next/link";
import { Mail, Phone, ShieldCheck } from "lucide-react";

import { routes } from "@/config/routes";
import { PropertyInquiryForm } from "@/features/crm/components";
import { CONTACT_INFO } from "../constants";
import type { PublicPropertyDetail } from "@/features/properties/types";
import {
  formatPropertyPriceValue,
  getListingTypeLabel,
} from "@/features/properties/utils/property-formatters";

interface PropertyDetailSidebarProps {
  property: PublicPropertyDetail;
}

export function PropertyDetailSidebar({ property }: PropertyDetailSidebarProps) {
  return (
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
          href={`${routes.public.contact}?property=${encodeURIComponent(property.title)}`}
          className="mt-4 flex h-11 items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted"
        >
          Genel İletişim Formu
        </Link>
      </div>

      <PropertyInquiryForm propertyId={property.id} propertyTitle={property.title} />

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold">Danışman</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Profesyonel emlak danışmanımız bu ilan hakkında size yardımcı olmaya hazır.
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Phone className="size-4" />
            {CONTACT_INFO.phone}
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Mail className="size-4" />
            {CONTACT_INFO.email}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold">Doğrulanmış İlan</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Bu ilan danışman kontrolünden geçmiştir.
          </p>
        </div>
      </div>

      {property.address ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold">Adres</h3>
          <p className="mt-2 text-sm text-muted-foreground">{property.address}</p>
        </div>
      ) : null}
    </aside>
  );
}
