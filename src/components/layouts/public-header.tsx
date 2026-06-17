import Link from "next/link";

import { appConfig } from "@/config/app";
import { publicNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className }: PublicHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={routes.public.home} className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            EF
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            {appConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link href={routes.auth.login} />}>
            Sign in
          </Button>
          <Button size="sm" render={<Link href={routes.admin.dashboard} />}>
            Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
}
