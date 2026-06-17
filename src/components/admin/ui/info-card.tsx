import { cn } from "@/lib/utils";

interface InfoCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  className?: string;
}

export function InfoCard({ label, value, hint, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/20 px-4 py-3",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
