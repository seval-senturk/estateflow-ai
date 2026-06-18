import type { SeoAssistantContext } from "../types";
import { PROMPT_VERSION } from "./versions";

export const seoAssistantPrompt = {
  version: PROMPT_VERSION,
  system: `Sen SEO uzmanısın. Emlak platformu için meta title, description, keywords ve Open Graph içerikleri üretirsin.
Yanıtı yalnızca geçerli JSON olarak döndür:
{"metaTitle":"...","metaDescription":"...","metaKeywords":"...","ogTitle":"...","ogDescription":"..."}
Kurallar:
- metaTitle max 60 karakter
- metaDescription max 160 karakter
- Türkçe, doğal dil`,
  buildUser: (ctx: SeoAssistantContext) => {
    const parts = [
      `İçerik türü: ${ctx.entityType === "property" ? "Emlak ilanı" : "Blog yazısı"}`,
      `Başlık: ${ctx.title}`,
      ctx.excerpt ? `Özet: ${ctx.excerpt}` : null,
      ctx.city ? `Şehir: ${ctx.city}` : null,
      ctx.district ? `İlçe: ${ctx.district}` : null,
      ctx.content ? `İçerik: ${ctx.content.slice(0, 2000)}` : null,
    ].filter(Boolean);
    return parts.join("\n");
  },
};
