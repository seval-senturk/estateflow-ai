import { Currency, LeadSource } from "@prisma/client";
import { z } from "zod";

export const leadFormSchema = z.object({
  firstName: z.string().trim().min(2, "Ad en az 2 karakter olmalıdır").max(100),
  lastName: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  phone: z.string().trim().max(30).optional(),
  source: z.nativeEnum(LeadSource),
  statusId: z.string().min(1, "Durum seçimi zorunludur"),
  assignedToId: z.string().optional(),
  propertyId: z.string().optional(),
  budget: z.coerce.number().positive().optional(),
  currency: z.nativeEnum(Currency).optional(),
  notes: z.string().trim().max(5000).optional(),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

export const leadListFiltersSchema = z.object({
  search: z.string().optional(),
  statusId: z.string().optional(),
  assignedToId: z.string().optional(),
  source: z.nativeEnum(LeadSource).optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(15),
  sortBy: z.enum(["createdAt", "updatedAt", "firstName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type LeadListFiltersInput = z.infer<typeof leadListFiltersSchema>;

export const leadNoteSchema = z.object({
  content: z.string().trim().min(1, "Not içeriği zorunludur").max(5000),
});

export type LeadNoteInput = z.infer<typeof leadNoteSchema>;

export const leadStatusUpdateSchema = z.object({
  statusId: z.string().min(1),
});

export const leadAssignSchema = z.object({
  assignedToId: z.string().nullable(),
});

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export const propertyInquirySchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(5000).optional(),
});

export type PropertyInquiryInput = z.infer<typeof propertyInquirySchema>;

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? fullName;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
  return { firstName, lastName };
}
