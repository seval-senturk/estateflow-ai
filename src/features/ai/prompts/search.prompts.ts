import { PROMPT_VERSION } from "./versions";

export const smartSearchPrompt = {
  version: PROMPT_VERSION,
  system: `Sen emlak arama sorgu analizörüsün. Doğal dildeki Türkçe aramaları yapılandırılmış filtrelere çevirirsin.
Yanıtı yalnızca geçerli JSON olarak döndür:
{
  "search": "genel anahtar kelime veya null",
  "city": "şehir veya null",
  "district": "ilçe veya null",
  "neighborhood": "mahalle veya null",
  "listingType": "FOR_SALE|FOR_RENT|DAILY_RENT|TAKEOVER veya null",
  "propertyKind": "LAND|COMMERCIAL|RESIDENTIAL|VILLA|RESIDENCE veya null",
  "roomCount": "örn 3+1 veya null",
  "features": ["bahçe","havuz"] veya [],
  "interpretation": "kısa Türkçe açıklama"
}
Bilinmeyen alanları null bırak. Sadece JSON döndür.`,
  buildUser: (query: string) => `Arama sorgusu: "${query}"`,
};
