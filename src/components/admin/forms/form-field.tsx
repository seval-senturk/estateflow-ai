"use client";

import { useFormContext } from "react-hook-form";

import { Input, type InputFieldProps } from "@/components/shared";

interface FormFieldProps extends Omit<InputFieldProps, "error"> {
  name: string;
}

export function FormField({ name, ...props }: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <Input
      {...register(name)}
      {...props}
      error={errorMessage}
    />
  );
}
