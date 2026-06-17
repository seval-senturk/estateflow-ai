import { AppImage, type AppImageProps } from "./app-image";
import { cn } from "@/lib/utils";

interface PropertyImageProps extends Omit<AppImageProps, "sizes"> {
  sizes?: string;
}

export function PropertyImage({ className, sizes = "(max-width: 768px) 100vw, 50vw", ...props }: PropertyImageProps) {
  return (
    <AppImage
      {...props}
      sizes={sizes}
      className={cn("rounded-xl", className)}
    />
  );
}
