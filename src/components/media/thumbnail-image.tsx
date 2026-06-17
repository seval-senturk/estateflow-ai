import { buildCloudinaryUrl } from "@/lib/cloudinary/transform";
import { cn } from "@/lib/utils";

interface ThumbnailImageProps {
  src: string;
  alt: string;
  publicId?: string | null;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ThumbnailImage({
  src,
  alt,
  publicId,
  active = false,
  className,
  onClick,
}: ThumbnailImageProps) {
  const imageSrc = publicId
    ? buildCloudinaryUrl(publicId, { width: 120, height: 80, crop: "fill" })
    : src;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative aspect-[3/2] overflow-hidden rounded-md border-2 transition-colors",
        active ? "border-primary" : "border-transparent opacity-80 hover:opacity-100",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt={alt} className="size-full object-cover" loading="lazy" />
    </button>
  );
}
