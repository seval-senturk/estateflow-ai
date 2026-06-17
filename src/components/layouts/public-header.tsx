import { publicNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { LinkButton } from "@/components/shared";
import { PublicLogo, PublicMobileNav } from "@/features/website/components";
import { PublicNavLinks } from "./public-nav-links";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className }: PublicHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md",
        className,
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <PublicLogo />

        <PublicNavLinks items={publicNavigation} className="hidden md:flex" />

        <div className="flex items-center gap-2">
          <LinkButton
            href={routes.auth.login}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Giriş Yap
          </LinkButton>
          <LinkButton
            href={routes.public.properties}
            size="sm"
            className="hidden sm:inline-flex"
          >
            İlanları Keşfet
          </LinkButton>
          <PublicMobileNav />
        </div>
      </div>
    </header>
  );
}
