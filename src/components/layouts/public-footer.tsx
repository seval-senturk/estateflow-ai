import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { appConfig } from "@/config/app";
import { publicNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { CONTACT_INFO } from "@/features/website/constants";
import { TrustBadges } from "@/features/website/components";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <TrustBadges variant="row" />
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <p className="font-heading text-lg font-semibold">{appConfig.name}</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Türkiye genelinde satılık ve kiralık emlak portföyü. Profesyonel danışmanlık
              ve güvenilir hizmet anlayışıyla yanınızdayız.
            </p>
          </div>

          <nav className="space-y-3">
            <p className="text-sm font-medium">Sayfalar</p>
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
            <p className="text-sm font-medium">İletişim</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {CONTACT_INFO.address}
              </li>
              <li>
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-foreground">
                  <Phone className="size-4 shrink-0" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 hover:text-foreground">
                  <Mail className="size-4 shrink-0" />
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {appConfig.name}. Tüm hakları saklıdır.</p>
          <Link href={routes.auth.login} className="hover:text-foreground">
            Danışman Girişi
          </Link>
        </div>
      </div>
    </footer>
  );
}
