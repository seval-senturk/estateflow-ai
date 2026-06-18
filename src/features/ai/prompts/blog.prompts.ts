import type { BlogAssistantContext } from "../types";
import { PROMPT_VERSION } from "./versions";

const BLOG_SYSTEM = `Sen emlak sektörüne odaklanan bir içerik stratejistisin. Türkçe, SEO uyumlu ve profesyonel içerik üretirsin.`;

export const blogTitleSuggestionsPrompt = {
  version: PROMPT_VERSION,
  system: BLOG_SYSTEM,
  buildUser: (ctx: BlogAssistantContext) =>
    `Konu: ${ctx.title ?? "Emlak"}\nÖzet: ${ctx.excerpt ?? "Yok"}\n\n5 adet çekici blog başlığı öner. JSON formatında döndür: {"titles":["..."]}`,
};

export const blogMetaDescriptionPrompt = {
  version: PROMPT_VERSION,
  system: BLOG_SYSTEM,
  buildUser: (ctx: BlogAssistantContext) =>
    `Başlık: ${ctx.title}\nİçerik özeti: ${ctx.excerpt ?? ctx.content?.slice(0, 500) ?? ""}\n\n160 karakteri geçmeyen meta description yaz. Sadece metni döndür.`,
};

export const blogContentDraftPrompt = {
  version: PROMPT_VERSION,
  system: `${BLOG_SYSTEM} HTML etiketleri kullanarak yapılandırılmış içerik üret (h2, p, ul).`,
  buildUser: (ctx: BlogAssistantContext) =>
    `Başlık: ${ctx.title}\nÖzet: ${ctx.excerpt ?? ""}\n\nBu başlık için 400-600 kelimelik blog taslağı yaz.`,
};

export const blogCategorySuggestionPrompt = {
  version: PROMPT_VERSION,
  system: BLOG_SYSTEM,
  buildUser: (ctx: BlogAssistantContext) => {
    const categories = ctx.categories?.map((c) => `${c.id}:${c.name}`).join(", ") ?? "";
    return `Başlık: ${ctx.title}\nÖzet: ${ctx.excerpt ?? ""}\n\nMevcut kategoriler (id:ad): ${categories}\n\nEn uygun kategoriyi seç. JSON döndür: {"categoryId":"...","categoryName":"..."}`;
  },
};
