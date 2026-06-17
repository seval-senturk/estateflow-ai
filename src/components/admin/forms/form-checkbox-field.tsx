"use client";

import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

interface FormCheckboxFieldProps {
  name: string;
  label: string;
  description?: string;
}

export function FormCheckboxField({ name, label, description }: FormCheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
          <input
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            className="mt-0.5 size-4 rounded border-border"
          />
          <span>
            <span className="block text-sm font-medium">{label}</span>
            {description ? (
              <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
            ) : null}
          </span>
        </label>
      )}
    />
  );
}

interface FormFeatureCheckboxProps {
  featureId: string;
  label: string;
  index: number;
}

export function FormFeatureCheckbox({ featureId, label, index }: FormFeatureCheckboxProps) {
  const { watch, setValue } = useFormContext();
  const features = watch("features") as Array<{ featureId: string; value: string }>;
  const checked = features?.[index]?.value === "true";

  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border px-4 py-3",
        checked && "border-primary/30 bg-primary/5",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          const next = [...(features ?? [])];
          next[index] = {
            featureId,
            value: event.target.checked ? "true" : "false",
          };
          setValue("features", next, { shouldDirty: true });
        }}
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
