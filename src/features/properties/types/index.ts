import type {
  Currency,
  HeatingType,
  ListingType,
  PropertyKind,
} from "@prisma/client";

export interface PropertyListItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: Currency;
  city: string | null;
  district: string | null;
  categoryName: string | null;
  statusName: string;
  statusSlug: string;
  statusColor: string | null;
  isPublished: boolean;
  createdAt: Date;
}

export interface PropertyListFilters {
  search?: string;
  statusId?: string;
  categoryId?: string;
  isPublished?: boolean;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "price" | "title";
  sortOrder?: "asc" | "desc";
}

export interface PropertyListResult {
  items: PropertyListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PropertyFeatureInput {
  featureId: string;
  value: string;
}

export interface PropertyFormValues {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  statusId: string;
  price: number;
  currency: Currency;
  listingType: ListingType;
  propertyKind: PropertyKind;
  city: string;
  district?: string;
  neighborhood?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  grossArea?: number;
  netArea?: number;
  roomCount?: string;
  bathroomCount?: number;
  buildingAge?: number;
  floor?: number;
  balconyCount?: number;
  heatingType?: HeatingType;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  features: PropertyFeatureInput[];
}

export interface PropertyDetail extends PropertyFormValues {
  id: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  statusName: string;
  statusSlug: string;
  statusColor: string | null;
  categoryName: string | null;
  featureDefinitions: Array<{
    id: string;
    name: string;
    slug: string;
    value: string;
  }>;
}

export interface PublicPropertyListItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  currency: Currency;
  listingType: ListingType;
  propertyKind: PropertyKind;
  city: string | null;
  district: string | null;
  roomCount: string | null;
  grossArea: number | null;
  isFeatured: boolean;
  publishedAt: Date | null;
  primaryImageUrl: string | null;
  primaryImagePublicId: string | null;
  categoryName: string | null;
}

export interface PublicPropertyFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  city?: string;
  listingType?: import("@prisma/client").ListingType;
  propertyKind?: import("@prisma/client").PropertyKind;
  isFeatured?: boolean;
  sortBy?: "publishedAt" | "price";
  sortOrder?: "asc" | "desc";
}

export interface PublicPropertyDetail extends PublicPropertyListItem {
  description: string | null;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  netArea: number | null;
  bathroomCount: number | null;
  buildingAge: number | null;
  floor: number | null;
  balconyCount: number | null;
  heatingType: HeatingType | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  features: Array<{ name: string; value: string }>;
  gallery: {
    images: Array<{
      id: string;
      url: string;
      alt: string | null;
      caption: string | null;
      publicId: string | null;
      isPrimary: boolean;
    }>;
    videos: Array<{
      id: string;
      url: string;
      title: string | null;
      provider: import("@prisma/client").MediaProvider;
      embedUrl: string | null;
      thumbnailUrl: string | null;
    }>;
  };
}
