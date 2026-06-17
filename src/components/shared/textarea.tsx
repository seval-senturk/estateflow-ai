import { Textarea as UiTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

export interface TextareaFieldProps extends ComponentProps<typeof UiTextarea> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: TextareaFieldProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}
      <UiTextarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        className={cn(error && "border-destructive", className)}
        {...props}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
