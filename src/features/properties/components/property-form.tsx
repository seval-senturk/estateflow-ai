"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";

import {
  AdminForm,
  FormCheckboxField,
  FormFeatureCheckbox,
  FormField,
  FormLayout,
  FormSection,
  FormSelectField,
  FormTextareaField,
} from "@/components/admin/forms";
import { Button } from "@/components/shared";

import { createPropertyAction, updatePropertyAction } from "../actions";
import {
  CURRENCY_LABELS,
  HEATING_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_KIND_LABELS,
} from "../constants";
import { propertyFormSchema, propertySlugFromTitle, type PropertyFormInput } from "../schemas";
import type { PropertyLookupData } from "../utils/property-form-defaults";
import { buildPropertyFormDefaults } from "../utils/property-form-defaults";
import type { PropertyDetail } from "../types";

interface PropertyFormProps {
  mode: "create" | "edit";
  lookup: PropertyLookupData;
  property?: PropertyDetail;
}

function toSelectOptions<T extends string>(labels: Record<T, string>) {
  return Object.entries(labels).map(([value, label]) => ({
    value,
    label: label as string,
  }));
}

export function PropertyForm({ mode, lookup, property }: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PropertyFormInput>({
    resolver: zodResolver(propertyFormSchema) as Resolver<PropertyFormInput>,
    defaultValues: buildPropertyFormDefaults(lookup, property),
  });

  const title = form.watch("title");

  useEffect(() => {
    if (!slugEdited && title) {
      form.setValue("slug", propertySlugFromTitle(title), { shouldDirty: true });
    }
  }, [form, slugEdited, title]);

  const onSubmit = (values: PropertyFormInput) => {
    setFormError(null);
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createPropertyAction(values)
          : await updatePropertyAction(property!.id, values);

      if (result && !result.success) {
        setFormError(result.error ?? "İlan kaydedilemedi.");
      }
    });
  };

  return (
    <AdminForm form={form} onSubmit={onSubmit}>
      <FormLayout
        sidebar={
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Kayıt Özeti</h3>
              <p className="text-xs text-muted-foreground">
                Değişiklikleri kaydetmeden önce tüm bölümleri gözden geçirin.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Kaydediliyor…" : mode === "create" ? "İlanı Oluştur" : "Değişiklikleri Kaydet"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              Vazgeç
            </Button>
            {formError ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            ) : null}
          </div>
        }
      >
        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection
            title="Genel Bilgiler"
            description="İlanın temel tanımlayıcı bilgileri."
          >
            <FormField
              name="title"
              label="Başlık"
              placeholder="Örn. Boğaz manzaralı 3+1 daire"
            />
            <FormField
              name="slug"
              label="Slug"
              placeholder="ornek-ilan-slug"
              onChange={() => setSlugEdited(true)}
            />
            <div className="sm:col-span-2">
              <FormTextareaField
                name="shortDescription"
                label="Kısa Açıklama"
                placeholder="Liste ve kart görünümlerinde gösterilecek özet"
                rows={3}
              />
            </div>
            <div className="sm:col-span-2">
              <FormTextareaField
                name="description"
                label="Açıklama"
                placeholder="İlanın detaylı açıklaması"
                rows={8}
              />
            </div>
            <FormSelectField
              name="categoryId"
              label="Kategori"
              placeholder="Kategori seçin"
              options={lookup.categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <FormSelectField
              name="statusId"
              label="Durum"
              placeholder="Durum seçin"
              options={lookup.statuses.map((status) => ({
                label: status.name,
                value: status.id,
              }))}
            />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="Fiyat Bilgileri" description="Fiyatlandırma ve ilan tipi.">
            <FormField name="price" label="Fiyat" type="number" min={0} step="1" />
            <FormSelectField
              name="currency"
              label="Para Birimi"
              options={toSelectOptions(CURRENCY_LABELS)}
            />
            <FormSelectField
              name="listingType"
              label="İlan Tipi"
              options={toSelectOptions(LISTING_TYPE_LABELS)}
            />
            <FormSelectField
              name="propertyKind"
              label="Emlak Türü"
              options={toSelectOptions(PROPERTY_KIND_LABELS)}
            />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="Konum" description="İlanın fiziksel konumu.">
            <FormField name="city" label="Şehir" placeholder="İstanbul" />
            <FormField name="district" label="İlçe" placeholder="Kadıköy" />
            <FormField name="neighborhood" label="Mahalle" placeholder="Moda" />
            <div className="sm:col-span-2">
              <FormTextareaField name="address" label="Adres" rows={2} />
            </div>
            <FormField name="latitude" label="Latitude" type="number" step="any" />
            <FormField name="longitude" label="Longitude" type="number" step="any" />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="Emlak Detayları" description="Metrekare ve yapısal özellikler.">
            <FormField name="grossArea" label="Brüt Metrekare" type="number" min={0} />
            <FormField name="netArea" label="Net Metrekare" type="number" min={0} />
            <FormField name="roomCount" label="Oda Sayısı" placeholder="3+1" />
            <FormField name="bathroomCount" label="Banyo Sayısı" type="number" min={0} />
            <FormField name="buildingAge" label="Bina Yaşı" type="number" min={0} />
            <FormField name="floor" label="Kat" type="number" />
            <FormField name="balconyCount" label="Balkon Sayısı" type="number" min={0} />
            <FormSelectField
              name="heatingType"
              label="Isıtma Türü"
              placeholder="Seçin"
              options={toSelectOptions(HEATING_TYPE_LABELS)}
            />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection
            title="Özellikler"
            description="İlana ait dinamik özellikler. Gelecekte admin panelden yönetilebilir."
          >
            <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lookup.features.map((feature, index) => (
                <FormFeatureCheckbox
                  key={feature.id}
                  featureId={feature.id}
                  label={feature.name}
                  index={index}
                />
              ))}
            </div>
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="Öne Çıkarma" description="Yayın ve vitrin ayarları.">
            <FormCheckboxField
              name="isFeatured"
              label="Öne Çıkan İlan"
              description="Ana sayfa ve öne çıkan listelerde gösterilir."
            />
            <FormCheckboxField
              name="isPublished"
              label="Yayın Durumu"
              description="Aktif olduğunda ilan public sitede görünür."
            />
            <FormField
              name="publishedAt"
              label="Yayın Tarihi"
              type="datetime-local"
            />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="SEO" description="Arama motoru ve sosyal paylaşım ayarları.">
            <FormField name="metaTitle" label="Meta Title" maxLength={160} />
            <div className="sm:col-span-2">
              <FormTextareaField
                name="metaDescription"
                label="Meta Description"
                rows={3}
                maxLength={320}
              />
            </div>
            <FormField
              name="canonicalUrl"
              label="Canonical URL"
              placeholder="https://example.com/properties/ilan-slug"
            />
            <FormField
              name="ogImage"
              label="Open Graph Görsel URL"
              placeholder="https://example.com/og-image.jpg"
            />
          </FormSection>
        </div>
      </FormLayout>
    </AdminForm>
  );
}
