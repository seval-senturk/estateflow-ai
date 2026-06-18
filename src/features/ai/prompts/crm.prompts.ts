import type { LeadSummaryContext } from "../types";
import { PROMPT_VERSION } from "./versions";

export const leadSummaryPrompt = {
  version: PROMPT_VERSION,
  system: `Sen CRM analistisin. Lead geçmişini analiz ederek satış ekibine kısa, eyleme dönük özet sunarsın.
3-5 madde halinde Türkçe özet yaz. Somut davranış kalıplarını vurgula.`,
  buildUser: (ctx: LeadSummaryContext) => {
    const lines = [
      `Lead: ${ctx.firstName} ${ctx.lastName ?? ""}`.trim(),
      `Kaynak: ${ctx.source}`,
      `Durum: ${ctx.status}`,
      ctx.budget ? `Bütçe: ${ctx.budget}` : null,
      ctx.propertyTitle ? `İlgilendiği ilan: ${ctx.propertyTitle}` : null,
      ctx.notes.length ? `Notlar:\n${ctx.notes.join("\n")}` : "Not yok",
      ctx.activities.length
        ? `Aktiviteler:\n${ctx.activities.map((a) => `- [${a.createdAt}] ${a.type}: ${a.description}`).join("\n")}`
        : "Aktivite yok",
    ].filter(Boolean);
    return lines.join("\n\n");
  },
};
