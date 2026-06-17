"use client";

import { Loader2 } from "lucide-react";

import { Button as UiButton, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof UiButton> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    loadingText?: string;
  };

export function Button({
  isLoading = false,
  loadingText,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <UiButton
      disabled={disabled ?? isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </UiButton>
  );
}

export { buttonVariants };
