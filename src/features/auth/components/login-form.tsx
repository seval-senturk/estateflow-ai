"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { Button, Input } from "@/components/shared";
import {
  AUTH_ERROR_CODES,
  AUTH_ERROR_MESSAGES,
} from "@/features/auth/constants";
import { loginAction } from "@/features/auth/actions";
import type { LoginActionState } from "@/features/auth/types";
import { routes } from "@/config/routes";

const initialState: LoginActionState = {
  success: false,
};

function resolveQueryError(code: string | null): string | undefined {
  if (!code) return undefined;

  if (code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES];
  }

  if (code === AUTH_ERROR_CODES.FORBIDDEN) {
    return AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.FORBIDDEN];
  }

  return undefined;
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  const callbackUrl = searchParams.get("callbackUrl") ?? routes.admin.dashboard;
  const queryError = resolveQueryError(searchParams.get("error"));
  const errorMessage = state.error ?? queryError;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="space-y-4">
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isPending} loadingText="Signing in...">
        Sign in to workspace
      </Button>
    </form>
  );
}
