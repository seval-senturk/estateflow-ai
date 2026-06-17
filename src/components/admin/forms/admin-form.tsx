"use client";

import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormProvider } from "react-hook-form";

import { cn } from "@/lib/utils";

interface AdminFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function AdminForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: AdminFormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        className={cn("space-y-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}
