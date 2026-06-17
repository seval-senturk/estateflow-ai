import { AppImage, type AppImageProps } from "./app-image";
import { cn } from "@/lib/utils";

export function GalleryImage(props: AppImageProps) {
  return (
    <AppImage
      {...props}
      fill
      sizes="(max-width: 768px) 100vw, 66vw"
      className={cn("object-cover", props.className)}
    />
  );
}
