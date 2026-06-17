"use client";

import { useFormContext } from "react-hook-form";

import { Textarea, type TextareaFieldProps } from "@/components/shared";

interface FormTextareaFieldProps extends Omit<TextareaFieldProps, "error"> {
  name: string;
}

export function FormTextareaField({ name, ...props }: FormTextareaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;
  const errorMessage = typeof error === "string" ? error : undefined;

  return <Textarea {...register(name)} {...props} error={errorMessage} />;
}
