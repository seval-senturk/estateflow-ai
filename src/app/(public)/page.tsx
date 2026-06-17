import Link from "next/link";

import { appConfig } from "@/config/app";
import { routes } from "@/config/routes";
import { Button } from "@/components/shared";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.92_0.03_250),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Real Estate Operations
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {appConfig.name}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {appConfig.tagline}. Coordinate listings, client relationships, and
            team workflows from one professional platform.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" render={<Link href={routes.public.properties} />}>
              Browse Properties
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href={routes.auth.login} />}
            >
              Agent Sign In
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
