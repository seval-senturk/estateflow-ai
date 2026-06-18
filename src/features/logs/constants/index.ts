import type { ActivityAction } from "@prisma/client";

export const LOG_LIST_PAGE_SIZE = 20;

export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  CREATE: "Oluşturma",
  UPDATE: "Güncelleme",
  DELETE: "Silme",
  VIEW: "Görüntüleme",
  LOGIN: "Giriş",
  LOGOUT: "Çıkış",
  PUBLISH: "Yayınlama",
  UNPUBLISH: "Yayından Kaldırma",
  UPLOAD: "Yükleme",
  EXPORT: "Dışa Aktarma",
  RESTORE: "Geri Yükleme",
};

export const LOG_TABS = [
  { id: "activity", label: "Aktivite Logları" },
  { id: "audit", label: "Audit Trail" },
  { id: "login", label: "Giriş Geçmişi" },
] as const;

export type LogTabId = (typeof LOG_TABS)[number]["id"];

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  PROPERTY: "İlan",
  BLOG_POST: "Blog",
  LEAD: "Lead",
  MEDIA: "Medya",
  USER: "Kullanıcı",
  SETTINGS: "Ayarlar",
  SECURITY: "Güvenlik",
};
