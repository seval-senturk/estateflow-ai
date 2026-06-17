import Link from "next/link";

import { PROPERTY_CATEGORIES, WHY_CHOOSE_US, COMPANY_STATS } from "../constants";
import { TrustBadges } from "./trust-badges";

export function WhyChooseUsSection() {
  return (
    <section className="space-y-10">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          Neden EstateFlow
        </p>
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          Güvenilir emlak deneyimi
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY_CHOOSE_US.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {COMPANY_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-6 text-center"
            >
              <p className="font-heading text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <TrustBadges />
    </section>
  );
}

export function CategorySection() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          Kategorilere Göz Atın
        </h2>
        <p className="text-muted-foreground">
          İhtiyacınıza uygun emlak türünü seçin.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PROPERTY_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <h3 className="font-heading text-lg font-semibold group-hover:text-primary">
              {category.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="rounded-2xl border border-border bg-card px-6 py-12 text-center sm:px-12">
      <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
        Hayalinizdeki mülkü birlikte bulalım
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        Uzman danışmanlarımız size özel portföy önerileri sunmak için hazır.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/contact"
          className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
        >
          Ücretsiz Danışmanlık
        </Link>
        <Link
          href="/properties"
          className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-medium"
        >
          İlanları İncele
        </Link>
      </div>
    </section>
  );
}
