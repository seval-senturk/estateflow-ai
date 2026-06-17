"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Select, type SelectOption } from "@/components/shared";

interface FormSelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function FormSelectField({
  name,
  label,
  options,
  placeholder,
}: FormSelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          label={label}
          options={options}
          placeholder={placeholder}
          value={field.value ?? ""}
          onValueChange={field.onChange}
          error={errorMessage}
        />
      )}
    />
  );
}
