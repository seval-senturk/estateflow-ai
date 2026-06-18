"use client";

import { useFormContext } from "react-hook-form";

import {
  HEATING_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_KIND_LABELS,
} from "@/features/properties/constants";
import type { PropertyFormInput } from "@/features/properties/schemas";
import type { PropertyLookupData } from "@/features/properties/utils/property-form-defaults";

import { generatePropertyDescriptionAction } from "../actions/ai.actions";
import { useAiAction } from "../hooks";
import { AiGenerateButton } from "./ai-generate-button";

interface AiPropertyDescriptionButtonProps {
  lookup: PropertyLookupData;
}

export function AiPropertyDescriptionButton({ lookup }: AiPropertyDescriptionButtonProps) {
  const form = useFormContext<PropertyFormInput>();
  const { execute, retry, isLoading, error } = useAiAction(generatePropertyDescriptionAction);

  const handleGenerate = async () => {
    const values = form.getValues();
    const selectedFeatures = values.features
      .filter((feature) => feature.value === "true")
      .map((feature) => lookup.features.find((f) => f.id === feature.featureId)?.name)
      .filter(Boolean) as string[];

    const result = await execute({
      title: values.title,
      roomCount: values.roomCount,
      grossArea: values.grossArea,
      netArea: values.netArea,
      city: values.city,
      district: values.district,
      neighborhood: values.neighborhood,
      listingType: values.listingType ? LISTING_TYPE_LABELS[values.listingType] : undefined,
      propertyKind: values.propertyKind ? PROPERTY_KIND_LABELS[values.propertyKind] : undefined,
      heatingType: values.heatingType ? HEATING_TYPE_LABELS[values.heatingType] : undefined,
      features: selectedFeatures,
      price: values.price,
      currency: values.currency,
    });

    if (result?.success) {
      form.setValue("description", result.data.description, { shouldDirty: true });
    }
  };

  return (
    <AiGenerateButton
      label="AI ile Açıklama Oluştur"
      loadingLabel="Açıklama oluşturuluyor…"
      isLoading={isLoading}
      error={error}
      onGenerate={handleGenerate}
      onRetry={retry}
    />
  );
}
