import {
  Currency,
  HeatingType,
  ListingType,
  PropertyKind,
} from "@prisma/client";
import { z } from "zod";

const optionalNumber = z.coerce.number().optional();
const optionalPositiveInt = z.coerce.number().int().min(0).optional();

export const propertyFeatureInputSchema = z.object({
  featureId: z.string().min(1),
  value: z.string(),
});

export const propertyFormSchema = z.object({
  title: z.string().trim().min(3, "Başlık en az 3 karakter olmalıdır").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir"),
  shortDescription: z.string().trim().max(500).optional(),
  description: z.string().trim().max(10000).optional(),
  categoryId: z.string().optional(),
  statusId: z.string().min(1, "Durum seçimi zorunludur"),
  price: z.coerce.number().positive("Fiyat 0'dan büyük olmalıdır"),
  currency: z.nativeEnum(Currency),
  listingType: z.nativeEnum(ListingType),
  propertyKind: z.nativeEnum(PropertyKind),
  city: z.string().trim().min(2, "Şehir zorunludur"),
  district: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  address: z.string().trim().max(1000).optional(),
  latitude: optionalNumber,
  longitude: optionalNumber,
  grossArea: optionalPositiveInt,
  netArea: optionalPositiveInt,
  roomCount: z.string().trim().optional(),
  bathroomCount: optionalPositiveInt,
  buildingAge: optionalPositiveInt,
  floor: z.coerce.number().int().optional(),
  balconyCount: optionalPositiveInt,
  heatingType: z.nativeEnum(HeatingType).optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.string().optional(),
  metaTitle: z.string().trim().max(160).optional(),
  metaDescription: z.string().trim().max(320).optional(),
  metaKeywords: z.string().trim().max(255).optional(),
  canonicalUrl: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  ogImage: z.string().url("Geçerli bir görsel URL'si girin").optional().or(z.literal("")),
  features: z.array(propertyFeatureInputSchema),
});

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;

export const propertyListFiltersSchema = z.object({
  search: z.string().optional(),
  statusId: z.string().optional(),
  categoryId: z.string().optional(),
  isPublished: z.enum(["all", "published", "draft"]).optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "price", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PropertyListFiltersInput = z.infer<typeof propertyListFiltersSchema>;

// Re-export for unrelated password validation reuse boundary
export const propertySlugFromTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
