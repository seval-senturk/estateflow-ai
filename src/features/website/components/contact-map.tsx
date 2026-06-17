import { CONTACT_INFO } from "../constants";

export function ContactMap() {
  const { mapLat, mapLng } = CONTACT_INFO;
  const bbox = `${mapLng - 0.01},${mapLat - 0.008},${mapLng + 0.01},${mapLat + 0.008}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapLat},${mapLng}`;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title="EstateFlow ofis konumu"
        src={src}
        className="h-72 w-full sm:h-96"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
