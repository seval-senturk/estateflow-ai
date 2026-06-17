import type { Metadata } from "next";

import { PropertySearchBar } from "@/features/search/components";
import {
  CategorySection,
  CtaSection,
  WhyChooseUsSection,
} from "@/features/website/components";
import { PropertyShowcase } from "@/features/website/components";
import { propertyService } from "@/features/properties/services";
import { buildOrganizationJsonLd } from "@/features/website/lib/structured-data";
import { seoConfig } from "@/config/seo";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description:
    "Satılık ve kiralık emlak ilanları. Profesyonel danışmanlık ve güvenilir hizmet.",
  openGraph: {
    title: `${seoConfig.defaultTitle} | Ana Sayfa`,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
  },
  alternates: { canonical: seoConfig.siteUrl },
};

export default async function HomePage() {
  const [featuredResult, latestResult] = await Promise.all([
    propertyService.listFeatured(6),
    propertyService.listPublished({ page: 1, pageSize: 6, sortBy: "publishedAt", sortOrder: "desc" }),
  ]);

  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              Güvenilir Emlak Danışmanlığı
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Hayalinizdeki mülkü keşfedin
            </h1>
            <p className="text-lg text-muted-foreground">
              Satılık ve kiralık portföyümüzü inceleyin. Uzman danışmanlarımız size
              özel çözümler sunar.
            </p>
            <PropertySearchBar />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <PropertyShowcase
          title="Öne Çıkan İlanlar"
          description="Seçkin portföyümüzden özenle seçilmiş ilanlar."
          properties={featuredResult.items}
        />

        <WhyChooseUsSection />

        <CategorySection />

        <PropertyShowcase
          title="Son Eklenen İlanlar"
          description="Portföyümüze yeni eklenen güncel ilanlar."
          properties={latestResult.items}
        />

        <CtaSection />
      </div>
    </>
  );
}
