"use client";

import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import { routes } from "@/config/routes";
import type { PublicPropertyListItem } from "@/features/properties/types";
import { formatPropertyPriceValue } from "@/features/properties/utils/property-formatters";

import "leaflet/dist/leaflet.css";

// Leaflet default icon paths break under bundlers — use CDN assets.
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapViewProps {
  properties: PublicPropertyListItem[];
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [41.0082, 28.9784];

export function PropertyMapView({ properties, className }: PropertyMapViewProps) {
  const markers = properties.filter(
    (property) => property.latitude != null && property.longitude != null,
  );

  const firstMarker = markers[0];
  const center: [number, number] =
    firstMarker?.latitude != null && firstMarker.longitude != null
      ? [firstMarker.latitude, firstMarker.longitude]
      : DEFAULT_CENTER;

  return (
    <div className={className ?? "h-[480px] overflow-hidden rounded-xl border border-border"}>
      <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude as number, property.longitude as number]}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{property.title}</p>
                <p className="text-muted-foreground">
                  {formatPropertyPriceValue(property.price, property.currency)}
                </p>
                <Link
                  href={routes.public.propertyDetail(property.slug)}
                  className="text-primary underline"
                >
                  İlanı Gör
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
