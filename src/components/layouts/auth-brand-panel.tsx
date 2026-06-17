import Link from "next/link";

import { appConfig } from "@/config/app";
import { routes } from "@/config/routes";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-primary lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.12_250/0.4),transparent_50%)]" />
      <div className="relative">
        <Link href={routes.public.home} className="inline-flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15 text-sm font-bold text-primary-foreground">
            EF
          </span>
          <span className="font-heading text-xl font-semibold text-primary-foreground">
            {appConfig.name}
          </span>
        </Link>
      </div>

      <div className="relative space-y-4">
        <h2 className="max-w-md font-heading text-3xl font-semibold leading-tight text-primary-foreground">
          Manage properties with clarity and precision
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/75">
          A unified platform for real estate teams to coordinate listings,
          leads, and operations from a single workspace.
        </p>
      </div>

      <p className="relative text-xs text-primary-foreground/50">
        Trusted by forward-thinking real estate professionals
      </p>
    </div>
  );
}
