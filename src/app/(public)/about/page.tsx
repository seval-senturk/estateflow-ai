import type { Metadata } from "next";

import { COMPANY_STATS, WHY_CHOOSE_US } from "@/features/website/constants";
import { TrustBadges } from "@/features/website/components";
import { buildOrganizationJsonLd } from "@/features/website/lib/structured-data";
import { seoConfig } from "@/config/seo";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "EstateFlow olarak emlak sektöründe güvenilir danışmanlık ve profesyonel hizmet sunuyoruz.",
  openGraph: {
    title: `Hakkımızda | ${seoConfig.defaultTitle}`,
    description: "Kurumsal emlak danışmanlığı ve güvenilir hizmet anlayışı.",
    url: `${seoConfig.siteUrl}${routes.public.about}`,
  },
  alternates: { canonical: `${seoConfig.siteUrl}${routes.public.about}` },
};

export default function AboutPage() {
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">Kurumsal</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Hakkımızda
          </h1>
          <p className="text-muted-foreground">
            EstateFlow, emlak sektöründe teknoloji ve uzmanlığı bir araya getiren
            profesyonel bir danışmanlık markasıdır.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">Misyonumuz</h2>
            <p className="leading-relaxed text-muted-foreground">
              Müşterilerimize doğru emlak kararları almalarında şeffaf, güvenilir ve
              kişiselleştirilmiş danışmanlık hizmeti sunmak. Her işlemde kurumsal
              standartları koruyarak sektörde güven oluşturmak.
            </p>
          </section>
          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">Vizyonumuz</h2>
            <p className="leading-relaxed text-muted-foreground">
              Türkiye&apos;nin en güvenilir emlak danışmanlık markalarından biri olmak.
              Teknoloji destekli süreçlerle müşteri deneyimini sürekli iyileştirmek.
            </p>
          </section>
        </div>

        <section className="mt-16 space-y-8">
          <h2 className="font-heading text-2xl font-semibold text-center">Neden Biz?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {COMPANY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-muted/30 p-6 text-center"
              >
                <p className="font-heading text-3xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <TrustBadges />
        </section>
      </div>
    </>
  );
}
