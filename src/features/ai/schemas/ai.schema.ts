import { z } from "zod";

export const propertyDescriptionContextSchema = z.object({
  title: z.string().trim().optional(),
  roomCount: z.string().trim().optional(),
  grossArea: z.coerce.number().optional(),
  netArea: z.coerce.number().optional(),
  city: z.string().trim().optional(),
  district: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  listingType: z.string().trim().optional(),
  propertyKind: z.string().trim().optional(),
  heatingType: z.string().trim().optional(),
  features: z.array(z.string()).optional(),
  price: z.coerce.number().optional(),
  currency: z.string().trim().optional(),
});

export const generatePropertyDescriptionSchema = propertyDescriptionContextSchema;

export const generatePropertySummarySchema = z.object({
  description: z.string().trim().min(50, "Özet için en az 50 karakterlik açıklama gerekli"),
  title: z.string().trim().optional(),
});

export const seoAssistantInputSchema = z.object({
  entityType: z.enum(["property", "blog"]),
  title: z.string().trim().min(3),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().optional(),
  city: z.string().trim().optional(),
  district: z.string().trim().optional(),
});

export const blogAssistantInputSchema = z.object({
  mode: z.enum(["titles", "meta", "draft", "category"]),
  title: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().optional(),
  categories: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .optional(),
});

export const contentImprovementInputSchema = z.object({
  entityType: z.enum(["property", "blog"]),
  title: z.string().trim().min(1),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  content: z.string().trim().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  metaKeywords: z.string().trim().optional(),
});

export const smartSearchInputSchema = z.object({
  query: z.string().trim().min(3, "Arama sorgusu en az 3 karakter olmalıdır").max(500),
});

export const leadSummaryInputSchema = z.object({
  leadId: z.string().min(1),
});

export type GeneratePropertyDescriptionInput = z.infer<typeof generatePropertyDescriptionSchema>;
export type GeneratePropertySummaryInput = z.infer<typeof generatePropertySummarySchema>;
export type SeoAssistantInput = z.infer<typeof seoAssistantInputSchema>;
export type BlogAssistantInput = z.infer<typeof blogAssistantInputSchema>;
export type ContentImprovementInput = z.infer<typeof contentImprovementInputSchema>;
export type SmartSearchInput = z.infer<typeof smartSearchInputSchema>;
export type LeadSummaryInput = z.infer<typeof leadSummaryInputSchema>;
