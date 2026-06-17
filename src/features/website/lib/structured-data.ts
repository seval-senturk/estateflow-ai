import { routes } from "@/config/routes";
import { seoConfig } from "@/config/seo";
import type { PublicPropertyDetail, PublicPropertyListItem } from "@/features/properties/types";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: seoConfig.defaultTitle,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
  };
}

export function buildPropertyListJsonLd(properties: PublicPropertyListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${seoConfig.siteUrl}${routes.public.propertyDetail(property.slug)}`,
      name: property.title,
    })),
  };
}

export function buildPropertyJsonLd(property: PublicPropertyDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.metaDescription ?? property.shortDescription ?? property.description,
    url: `${seoConfig.siteUrl}${routes.public.propertyDetail(property.slug)}`,
    image: property.primaryImageUrl ?? property.gallery.images[0]?.url,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city ?? undefined,
      addressRegion: property.district ?? undefined,
      streetAddress: property.address ?? undefined,
      addressCountry: "TR",
    },
  };
}
