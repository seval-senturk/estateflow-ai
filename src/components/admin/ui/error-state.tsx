import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this section.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-56 flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" />
      </div>
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
