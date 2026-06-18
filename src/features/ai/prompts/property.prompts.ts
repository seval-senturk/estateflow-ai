import type { PropertyDescriptionContext } from "../types";
import { PROMPT_VERSION } from "./versions";

const SYSTEM = `Sen profesyonel bir emlak danışmanısın. Türkçe, güven veren ve satış odaklı ilan açıklamaları yazarsın.
Kurallar:
- Abartılı veya yanıltıcı ifadeler kullanma
- Somut özelliklere odaklan
- Paragraflar halinde, okunabilir yapı
- Emoji kullanma
- Sadece açıklama metnini döndür, başlık veya ek not ekleme`;

export const propertyDescriptionPrompt = {
  version: PROMPT_VERSION,
  system: SYSTEM,
  buildUser: (ctx: PropertyDescriptionContext) => {
    const lines = [
      "Aşağıdaki bilgilere göre profesyonel bir emlak ilan açıklaması yaz:",
      ctx.title ? `Başlık: ${ctx.title}` : null,
      ctx.roomCount ? `Oda: ${ctx.roomCount}` : null,
      ctx.grossArea ? `Brüt m²: ${ctx.grossArea}` : null,
      ctx.netArea ? `Net m²: ${ctx.netArea}` : null,
      ctx.city ? `Şehir: ${ctx.city}` : null,
      ctx.district ? `İlçe: ${ctx.district}` : null,
      ctx.neighborhood ? `Mahalle: ${ctx.neighborhood}` : null,
      ctx.listingType ? `İlan tipi: ${ctx.listingType}` : null,
      ctx.propertyKind ? `Emlak türü: ${ctx.propertyKind}` : null,
      ctx.heatingType ? `Isıtma: ${ctx.heatingType}` : null,
      ctx.price ? `Fiyat: ${ctx.price} ${ctx.currency ?? "TRY"}` : null,
      ctx.features?.length ? `Özellikler: ${ctx.features.join(", ")}` : null,
    ].filter(Boolean);

    return lines.join("\n");
  },
};

export const propertySummaryPrompt = {
  version: PROMPT_VERSION,
  system: `Sen emlak içerik editörüsün. Uzun ilan açıklamalarını 2-3 cümlelik, net bir özete dönüştürürsün.
Sadece özet metnini döndür. "Bu ilanın kısa özeti:" gibi ön ek kullanma.`,
  buildUser: (description: string, title?: string) =>
    `İlan başlığı: ${title ?? "Belirtilmedi"}\n\nAçıklama:\n${description.slice(0, 4000)}`,
};
