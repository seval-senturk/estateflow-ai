import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function DataCard({
  title,
  description,
  children,
  footer,
  className,
}: DataCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
      {footer ? (
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
