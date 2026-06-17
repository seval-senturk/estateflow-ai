import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm, ContactMap } from "@/features/website/components";
import { CONTACT_INFO } from "@/features/website/constants";
import { seoConfig } from "@/config/seo";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Emlak danışmanlığı için bizimle iletişime geçin. Adres, telefon ve e-posta bilgileri.",
  openGraph: {
    title: `İletişim | ${seoConfig.defaultTitle}`,
    description: "Profesyonel emlak danışmanlığı için bize ulaşın.",
    url: `${seoConfig.siteUrl}${routes.public.contact}`,
  },
  alternates: { canonical: `${seoConfig.siteUrl}${routes.public.contact}` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">İletişim</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Bizimle İletişime Geçin
        </h1>
        <p className="text-muted-foreground">
          İlanlar hakkında bilgi almak veya danışmanlık talep etmek için formu doldurun.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <ContactForm />

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold">İletişim Bilgileri</h2>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {CONTACT_INFO.address}
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                {CONTACT_INFO.hours}
              </li>
            </ul>
          </div>

          <ContactMap />
        </aside>
      </div>
    </div>
  );
}
