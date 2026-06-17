import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

const trendStyles = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
} as const;

export function StatCard({
  label,
  value,
  change,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-semibold tracking-tight">
            {value}
          </p>
          {change ? (
            <p className={cn("text-xs font-medium", trendStyles[change.trend])}>
              {change.value}
            </p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
