import { KANBAN_STATUS_SLUGS } from "../constants";
import type { LeadListItem } from "../types";

export interface KanbanColumn {
  slug: string;
  title: string;
  items: LeadListItem[];
}

const KANBAN_TITLES: Record<string, string> = {
  yeni: "Yeni",
  "iletisim-kuruldu": "İletişim Kuruldu",
  "randevu-planlandi": "Randevu",
  "teklif-verildi": "Teklif",
  kazanildi: "Kazanıldı",
  kaybedildi: "Kaybedildi",
};

export function buildKanbanColumns(
  data: Array<{ slug: string; items: LeadListItem[] }>,
): KanbanColumn[] {
  return KANBAN_STATUS_SLUGS.map((slug) => {
    const column = data.find((entry) => entry.slug === slug);
    return {
      slug,
      title: KANBAN_TITLES[slug] ?? slug,
      items: column?.items ?? [],
    };
  });
}
