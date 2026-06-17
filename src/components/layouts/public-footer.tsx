import Link from "next/link";

import { appConfig } from "@/config/app";
import { publicNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="font-heading text-lg font-semibold">{appConfig.name}</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              {appConfig.tagline}
            </p>
          </div>

          <nav className="space-y-3">
            <p className="text-sm font-medium">Navigation</p>
            <ul className="space-y-2">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <p className="text-sm font-medium">Platform</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={routes.auth.login}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Agent Portal
                </Link>
              </li>
              <li>
                <Link
                  href={routes.public.contact}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          © {year} {appConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
