"use client";

import { useEffect } from "react";

import { Button } from "@/components/shared";
import { getErrorMessage, isBaseError } from "@/lib/errors";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  const message = isBaseError(error)
    ? error.message
    : getErrorMessage(error);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium tracking-wide text-destructive uppercase">
          Application Error
        </p>
        <h1 className="font-heading text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
