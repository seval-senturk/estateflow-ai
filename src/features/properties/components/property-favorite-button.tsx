"use client";

import { Heart } from "lucide-react";

interface PropertyFavoriteButtonProps {
  propertyId: string;
}

export function PropertyFavoriteButton({ propertyId }: PropertyFavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-label="Favorilere ekle"
      data-property-id={propertyId}
      className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Heart className="size-4" />
    </button>
  );
}
