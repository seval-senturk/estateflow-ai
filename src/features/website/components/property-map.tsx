interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  const bbox = `${longitude - 0.008},${latitude - 0.006},${longitude + 0.008},${latitude + 0.006}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Konum</h2>
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe
          title={`${title} konumu`}
          src={src}
          className="h-72 w-full sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
