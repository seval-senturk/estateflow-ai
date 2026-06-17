"use client";

import { useFormContext } from "react-hook-form";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { cn } from "@/lib/utils";

interface FormRichTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function FormRichTextField({
  name,
  label,
  placeholder,
  className,
}: FormRichTextFieldProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const value = (watch(name) as string) ?? "";
  const error = errors[name]?.message;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-sm font-medium text-foreground" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <RichTextEditor
        value={value}
        onChange={(html) => setValue(name, html, { shouldDirty: true, shouldValidate: true })}
        placeholder={placeholder}
      />
      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
