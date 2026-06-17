"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Pencil } from "lucide-react";

import { Button } from "@/components/shared";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

import { updatePropertyStatusAction } from "../actions";
import { PROPERTY_DETAIL_TABS, type PropertyDetailTabId } from "../constants";
import { PropertyStatusBadge } from "./property-status-badge";
import type { PropertyDetail } from "../types";
import {
  formatPropertyDate,
  formatPropertyPriceValue,
  getHeatingTypeLabel,
  getListingTypeLabel,
  getPropertyKindLabel,
} from "../utils/property-formatters";

interface StatusOption {
  id: string;
  name: string;
}

interface PropertyDetailTabsProps {
  property: PropertyDetail;
  statuses: StatusOption[];
  canUpdate: boolean;
}

function DetailField({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

export function PropertyDetailTabs({
  property,
  statuses,
  canUpdate,
}: PropertyDetailTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PropertyDetailTabId>("general");
  const [isPending, startTransition] = useTransition();
  const [statusError, setStatusError] = useState<string | null>(null);

  const activeFeatures = property.featureDefinitions.filter(
    (feature) => feature.value === "true",
  );

  const handleStatusChange = (statusId: string) => {
    setStatusError(null);
    startTransition(async () => {
      const result = await updatePropertyStatusAction(property.id, statusId);
      if (result && !result.success) {
        setStatusError(result.error ?? "Durum güncellenemedi.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <PropertyStatusBadge
              label={property.statusName}
              color={property.statusColor}
            />
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                property.isPublished
                  ? "bg-emerald-500/10 text-emerald-700"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {property.isPublished ? "Yayında" : "Yayında Değil"}
            </span>
            {property.isFeatured ? (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700">
                Öne Çıkan
              </span>
            ) : null}
          </div>
          <h2 className="font-heading text-2xl font-semibold">{property.title}</h2>
          <p className="text-sm text-muted-foreground">
            {formatPropertyPriceValue(property.price, property.currency)} ·{" "}
            {getListingTypeLabel(property.listingType)} · {property.city}
            {property.district ? `, ${property.district}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canUpdate ? (
            <Button
              variant="outline"
              render={<Link href={routes.admin.propertyEdit(property.id)} />}
            >
              <Pencil className="size-4" />
              Düzenle
            </Button>
          ) : null}
          <Button
            variant="outline"
            render={<Link href={routes.admin.propertyPreview(property.id)} />}
          >
            <ExternalLink className="size-4" />
            Önizleme
          </Button>
          {property.isPublished ? (
            <Button
              variant="outline"
              render={<Link href={routes.public.propertyDetail(property.slug)} target="_blank" />}
            >
              Public Görünüm
            </Button>
          ) : null}
        </div>
      </div>

      {canUpdate ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold">Durum Yönetimi</h3>
              <p className="text-xs text-muted-foreground">
                İlan yaşam döngüsünü buradan güncelleyin.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status.id}
                  type="button"
                  size="sm"
                  variant={property.statusId === status.id ? "default" : "outline"}
                  disabled={isPending || property.statusId === status.id}
                  onClick={() => handleStatusChange(status.id)}
                >
                  {status.name}
                </Button>
              ))}
            </div>
          </div>
          {statusError ? (
            <p className="mt-2 text-sm text-destructive">{statusError}</p>
          ) : null}
        </div>
      ) : null}

      <div className="border-b border-border">
        <nav className="-mb-px flex gap-4 overflow-x-auto">
          {PROPERTY_DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {activeTab === "general" ? (
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Başlık" value={property.title} />
            <DetailField label="Slug" value={property.slug} />
            <DetailField label="Kategori" value={property.categoryName} />
            <DetailField label="Emlak Türü" value={getPropertyKindLabel(property.propertyKind)} />
            <DetailField label="Fiyat" value={formatPropertyPriceValue(property.price, property.currency)} />
            <DetailField label="İlan Tipi" value={getListingTypeLabel(property.listingType)} />
            <DetailField label="Oda" value={property.roomCount} />
            <DetailField label="Brüt m²" value={property.grossArea} />
            <DetailField label="Net m²" value={property.netArea} />
            <DetailField label="Görüntülenme" value={property.viewCount} />
            <DetailField label="Oluşturulma" value={formatPropertyDate(property.createdAt)} />
            <DetailField label="Güncellenme" value={formatPropertyDate(property.updatedAt)} />
            <div className="sm:col-span-2 lg:col-span-3">
              <DetailField label="Kısa Açıklama" value={property.shortDescription} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <DetailField label="Açıklama" value={property.description} />
            </div>
          </dl>
        ) : null}

        {activeTab === "location" ? (
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Şehir" value={property.city} />
            <DetailField label="İlçe" value={property.district} />
            <DetailField label="Mahalle" value={property.neighborhood} />
            <DetailField label="Latitude" value={property.latitude} />
            <DetailField label="Longitude" value={property.longitude} />
            <div className="sm:col-span-2 lg:col-span-3">
              <DetailField label="Adres" value={property.address} />
            </div>
          </dl>
        ) : null}

        {activeTab === "features" ? (
          <div className="space-y-6">
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <DetailField label="Banyo" value={property.bathroomCount} />
              <DetailField label="Bina Yaşı" value={property.buildingAge} />
              <DetailField label="Kat" value={property.floor} />
              <DetailField label="Balkon" value={property.balconyCount} />
              <DetailField
                label="Isıtma"
                value={property.heatingType ? getHeatingTypeLabel(property.heatingType) : undefined}
              />
            </dl>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Seçili Özellikler</h4>
              {activeFeatures.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeFeatures.map((feature) => (
                    <span
                      key={feature.id}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {feature.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Henüz özellik seçilmemiş.</p>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "media" ? (
          <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Medya yönetimi Faz 6 medya modülü ile entegre edilecek.
            </p>
          </div>
        ) : null}

        {activeTab === "seo" ? (
          <dl className="grid gap-6 sm:grid-cols-2">
            <DetailField label="Meta Title" value={property.metaTitle ?? property.title} />
            <DetailField label="Canonical URL" value={property.canonicalUrl} />
            <div className="sm:col-span-2">
              <DetailField
                label="Meta Description"
                value={property.metaDescription ?? property.shortDescription}
              />
            </div>
            <DetailField label="Open Graph Görsel" value={property.ogImage} />
            <DetailField
              label="Public URL"
              value={
                <Link
                  href={routes.public.propertyDetail(property.slug)}
                  className="text-primary hover:underline"
                >
                  {routes.public.propertyDetail(property.slug)}
                </Link>
              }
            />
          </dl>
        ) : null}
      </div>
    </div>
  );
}
