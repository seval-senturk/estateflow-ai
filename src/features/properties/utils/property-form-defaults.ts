import type { PropertyCategory, PropertyFeature, PropertyStatus } from "@prisma/client";

import type { PropertyDetail } from "../types";
import type { PropertyFormInput } from "../schemas";

export interface PropertyLookupData {
  statuses: PropertyStatus[];
  categories: PropertyCategory[];
  features: PropertyFeature[];
}

export function buildFeatureDefaults(
  features: PropertyFeature[],
  existing?: Array<{ featureId: string; value: string }>,
) {
  return features.map((feature) => ({
    featureId: feature.id,
    value:
      existing?.find((entry) => entry.featureId === feature.id)?.value ?? "false",
  }));
}

export function buildPropertyFormDefaults(
  lookup: PropertyLookupData,
  property?: PropertyDetail,
): PropertyFormInput {
  const defaultStatus =
    lookup.statuses.find((status) => status.isDefault) ?? lookup.statuses[0];

  const features = buildFeatureDefaults(lookup.features, property?.features);

  if (property) {
    return {
      title: property.title,
      slug: property.slug,
      shortDescription: property.shortDescription,
      description: property.description,
      categoryId: property.categoryId,
      statusId: property.statusId,
      price: property.price,
      currency: property.currency,
      listingType: property.listingType,
      propertyKind: property.propertyKind,
      city: property.city,
      district: property.district,
      neighborhood: property.neighborhood,
      address: property.address,
      latitude: property.latitude,
      longitude: property.longitude,
      grossArea: property.grossArea,
      netArea: property.netArea,
      roomCount: property.roomCount,
      bathroomCount: property.bathroomCount,
      buildingAge: property.buildingAge,
      floor: property.floor,
      balconyCount: property.balconyCount,
      heatingType: property.heatingType,
      isFeatured: property.isFeatured,
      isPublished: property.isPublished,
      publishedAt: property.publishedAt,
      metaTitle: property.metaTitle,
      metaDescription: property.metaDescription,
      canonicalUrl: property.canonicalUrl ?? "",
      ogImage: property.ogImage ?? "",
      features,
    };
  }

  return {
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    categoryId: undefined,
    statusId: defaultStatus?.id ?? "",
    price: 0,
    currency: "TRY",
    listingType: "FOR_SALE",
    propertyKind: "RESIDENTIAL",
    city: "",
    district: "",
    neighborhood: "",
    address: "",
    isFeatured: false,
    isPublished: false,
    features,
  };
}
