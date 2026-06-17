import { ShieldCheck, Users, Clock, Building2 } from "lucide-react";

import { TRUST_ELEMENTS } from "../constants";

const ICONS = {
  verified: ShieldCheck,
  advisor: Users,
  fast: Clock,
  corporate: Building2,
} as const;

interface TrustBadgesProps {
  variant?: "row" | "grid";
  className?: string;
}

export function TrustBadges({ variant = "grid", className }: TrustBadgesProps) {
  return (
    <div
      className={
        variant === "row"
          ? `flex flex-wrap gap-4 ${className ?? ""}`
          : `grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className ?? ""}`
      }
    >
      {TRUST_ELEMENTS.map((item) => {
        const Icon = ICONS[item.id as keyof typeof ICONS];
        return (
          <div
            key={item.id}
            className="flex gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
