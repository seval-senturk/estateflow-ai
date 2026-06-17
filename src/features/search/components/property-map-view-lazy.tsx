"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { PublicPropertyListItem } from "@/features/properties/types";

function MapPlaceholder() {
  return <div className="h-[480px] animate-pulse rounded-xl bg-muted" aria-hidden />;
}

const PropertyMapView = dynamic(
  () =>
    import("./property-map-view").then((module) => module.PropertyMapView),
  {
    ssr: false,
    loading: MapPlaceholder,
  },
);

interface PropertyMapViewLazyProps {
  properties: PublicPropertyListItem[];
}

export function PropertyMapViewLazy({ properties }: PropertyMapViewLazyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <MapPlaceholder />;
  }

  return <PropertyMapView properties={properties} />;
}
