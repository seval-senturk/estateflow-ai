import type { LeadActivityType, LeadSource } from "@prisma/client";

export const CRM_ERROR_CODES = {
  NOT_FOUND: "CRM_LEAD_NOT_FOUND",
  INVALID_STATUS: "CRM_INVALID_STATUS",
} as const;

export const LEAD_LIST_PAGE_SIZE = 15;

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  WEBSITE: "Web Sitesi",
  PHONE: "Telefon",
  EMAIL: "E-posta",
  REFERRAL: "Referans",
  SOCIAL_MEDIA: "Sosyal Medya",
  PROPERTY_INQUIRY: "İlan Talebi",
  CONTACT_FORM: "İletişim Formu",
  WALK_IN: "Ofis Ziyareti",
  WHATSAPP: "WhatsApp",
  MANUAL_ENTRY: "Manuel Giriş",
  OTHER: "Diğer",
};

export const LEAD_ACTIVITY_LABELS: Record<LeadActivityType, string> = {
  LEAD_CREATED: "Lead Oluşturuldu",
  LEAD_UPDATED: "Lead Güncellendi",
  STATUS_CHANGED: "Durum Değiştirildi",
  NOTE_ADDED: "Not Eklendi",
  AGENT_ASSIGNED: "Danışman Atandı",
  AGENT_UNASSIGNED: "Danışman Ataması Kaldırıldı",
  PROPERTY_LINKED: "İlan İlişkilendirildi",
};

export const KANBAN_STATUS_SLUGS = [
  "yeni",
  "iletisim-kuruldu",
  "randevu-planlandi",
  "teklif-verildi",
  "kazanildi",
  "kaybedildi",
] as const;

export const LEAD_DETAIL_TABS = [
  { id: "overview", label: "Genel Bakış" },
  { id: "timeline", label: "Zaman Çizelgesi" },
  { id: "notes", label: "Notlar" },
] as const;
