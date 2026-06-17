import Link from "next/link";

import { LinkButton } from "@/components/shared";
import { routes } from "@/config/routes";
import { EMPTY_STATE_SUGGESTIONS } from "@/features/search/constants";

export function PropertySearchEmpty() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
      <h2 className="font-heading text-xl font-semibold">Aramanıza uygun ilan bulunamadı</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Filtreleri gevşetmeyi veya aşağıdaki önerilerden birini denemeyi düşünün.
      </p>
      <LinkButton href={routes.public.properties} variant="outline" className="mt-6">
        Tüm Filtreleri Temizle
      </LinkButton>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {EMPTY_STATE_SUGGESTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary/30"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
