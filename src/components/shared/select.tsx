"use client";

import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export function Select({
  label,
  error,
  hint,
  placeholder = "Select an option",
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <UiSelect
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => onValueChange?.(val)}
        disabled={disabled}
      >
        <SelectTrigger
          aria-invalid={Boolean(error)}
          className={cn("w-full", error && "border-destructive", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </UiSelect>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
