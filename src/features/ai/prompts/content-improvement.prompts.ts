import type { ContentImprovementContext } from "../types";
import { PROMPT_VERSION } from "./versions";

export const contentImprovementPrompt = {
  version: PROMPT_VERSION,
  system: `Sen içerik kalite denetçisisin. Emlak ilanı veya blog içeriklerini analiz edersin.
Yanıtı yalnızca geçerli JSON olarak döndür:
{
  "score": 0-100 arası sayı,
  "missingFields": ["eksik alanlar"],
  "seoSuggestions": ["SEO önerileri"],
  "qualitySuggestions": ["içerik kalitesi önerileri"]
}`,
  buildUser: (ctx: ContentImprovementContext) => {
    const parts = [
      `Tür: ${ctx.entityType}`,
      `Başlık: ${ctx.title}`,
      ctx.shortDescription ? `Kısa açıklama: ${ctx.shortDescription}` : null,
      ctx.description ? `Açıklama: ${ctx.description.slice(0, 3000)}` : null,
      ctx.content ? `İçerik: ${ctx.content.slice(0, 3000)}` : null,
      ctx.metaTitle ? `Meta title: ${ctx.metaTitle}` : null,
      ctx.metaDescription ? `Meta description: ${ctx.metaDescription}` : null,
      ctx.metaKeywords ? `Keywords: ${ctx.metaKeywords}` : null,
    ].filter(Boolean);
    return parts.join("\n");
  },
};
