import Link from "next/link";

import { cn } from "@/lib/utils";

interface BlogTableOfContentsProps {
  items: Array<{ id: string; text: string; level: number }>;
  className?: string;
}

export function BlogTableOfContents({ items, className }: BlogTableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="İçindekiler" className={cn("rounded-xl border border-border bg-muted/30 p-4", className)}>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        İçindekiler
      </h2>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
            <Link href={`#${item.id}`} className="text-foreground hover:text-primary">
              {item.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
