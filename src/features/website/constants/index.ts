import { routes } from "@/config/routes";

export const TRUST_ELEMENTS = [
  {
    id: "verified",
    title: "Doğrulanmış İlanlar",
    description: "Her ilan danışman kontrolünden geçer.",
  },
  {
    id: "advisor",
    title: "Profesyonel Danışman",
    description: "Deneyimli emlak uzmanlarından destek.",
  },
  {
    id: "fast",
    title: "Hızlı İletişim",
    description: "24 saat içinde geri dönüş taahhüdü.",
  },
  {
    id: "corporate",
    title: "Kurumsal Hizmet",
    description: "Şeffaf süreç, güvenilir hizmet.",
  },
] as const;

export const COMPANY_STATS = [
  { label: "Aktif İlan", value: "500+" },
  { label: "Mutlu Müşteri", value: "1.200+" },
  { label: "Yıllık Deneyim", value: "15+" },
  { label: "Şehir", value: "12" },
] as const;

export const WHY_CHOOSE_US = [
  {
    title: "Doğru Eşleşme",
    description: "İhtiyacınıza uygun portföyü veri odaklı eşleştirme ile sunuyoruz.",
  },
  {
    title: "Şeffaf Süreç",
    description: "Fiyat, konum ve tapu süreçlerinde net bilgilendirme.",
  },
  {
    title: "Uzman Danışmanlık",
    description: "Bölge uzmanı danışmanlarla uçtan uca destek.",
  },
  {
    title: "Güvenli İşlem",
    description: "Kurumsal standartlarda sözleşme ve takip süreci.",
  },
] as const;

export const PROPERTY_CATEGORIES = [
  {
    name: "Konut",
    slug: "konut",
    description: "Daire ve apartman seçenekleri",
    href: `${routes.public.properties}?kind=RESIDENTIAL`,
  },
  {
    name: "Villa",
    slug: "villa",
    description: "Müstakil yaşam alanları",
    href: `${routes.public.properties}?kind=VILLA`,
  },
  {
    name: "Arsa",
    slug: "arsa",
    description: "Yatırımlık arsa fırsatları",
    href: `${routes.public.properties}?kind=LAND`,
  },
  {
    name: "İşyeri",
    slug: "isyeri",
    description: "Ticari ve ofis alanları",
    href: `${routes.public.properties}?kind=COMMERCIAL`,
  },
  {
    name: "Rezidans",
    slug: "rezidans",
    description: "Lüks rezidans projeleri",
    href: `${routes.public.properties}?kind=RESIDENCE`,
  },
] as const;

export const CONTACT_INFO = {
  address: "Levent, Büyükdere Cd. No:123, Şişli / İstanbul",
  phone: "+90 (212) 555 00 00",
  email: "info@estateflow.ai",
  hours: "Pazartesi – Cuma: 09:00 – 18:00",
  mapLat: 41.0822,
  mapLng: 29.0107,
} as const;
