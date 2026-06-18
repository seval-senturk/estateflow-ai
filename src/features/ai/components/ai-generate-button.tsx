"use client";

import { Loader2, RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/shared";

interface AiGenerateButtonProps {
  label?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  disabled?: boolean;
  onGenerate: () => void | Promise<void>;
  onRetry?: () => void | Promise<void>;
  size?: "sm" | "default";
  variant?: "outline" | "secondary" | "default";
}

export function AiGenerateButton({
  label = "AI ile Oluştur",
  loadingLabel = "Oluşturuluyor…",
  isLoading = false,
  error,
  disabled = false,
  onGenerate,
  onRetry,
  size = "sm",
  variant = "outline",
}: AiGenerateButtonProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size={size}
          variant={variant}
          disabled={disabled || isLoading}
          onClick={() => void onGenerate()}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isLoading ? loadingLabel : label}
        </Button>
        {error && onRetry ? (
          <Button type="button" size={size} variant="ghost" onClick={() => void onRetry()}>
            <RefreshCw className="size-4" />
            Tekrar Dene
          </Button>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
