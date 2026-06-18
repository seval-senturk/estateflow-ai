import type { AuditAction } from "@prisma/client";

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: "Oluşturuldu",
  UPDATE: "Güncellendi",
  DELETE: "Silindi",
  RESTORE: "Geri Yüklendi",
};
