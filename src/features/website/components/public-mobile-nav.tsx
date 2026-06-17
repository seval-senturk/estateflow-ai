"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { appConfig } from "@/config/app";
import { publicNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

export function PublicMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open ? (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium",
                  pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Button variant="outline" render={<Link href={routes.auth.login} />}>
              Giriş Yap
            </Button>
            <Button render={<Link href={routes.public.properties} />}>
              İlanları Keşfet
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PublicLogo() {
  return (
    <Link href={routes.public.home} className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
        EF
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">
        {appConfig.name}
      </span>
    </Link>
  );
}
