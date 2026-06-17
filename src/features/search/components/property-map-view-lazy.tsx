"use client";

import dynamic from "next/dynamic";

import type { PublicPropertyListItem } from "@/features/properties/types";

const PropertyMapView = dynamic(
  () =>
    import("./property-map-view").then((module) => module.PropertyMapView),
  {
    ssr: false,
    loading: () => <div className="h-[480px] animate-pulse rounded-xl bg-muted" />,
  },
);

interface PropertyMapViewLazyProps {
  properties: PublicPropertyListItem[];
}

export function PropertyMapViewLazy({ properties }: PropertyMapViewLazyProps) {
  return <PropertyMapView properties={properties} />;
}
