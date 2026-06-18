"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { auth, signIn, signOut } from "@/lib/auth";
import { getLogContext, trackActivity } from "@/lib/logging";
import { routes } from "@/config/routes";
import {
  AUTH_ERROR_CODES,
  AUTH_ERROR_MESSAGES,
} from "@/features/auth/constants";
import { loginSchema } from "@/features/auth/schemas";
import type { LoginActionState } from "@/features/auth/types";

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      code: AUTH_ERROR_CODES.VALIDATION_ERROR,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.VALIDATION_ERROR],
    };
  }

  const callbackUrl =
    (formData.get("callbackUrl") as string | null) ?? routes.admin.dashboard;

  try {
    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    if (result?.error) {
      const code =
        result.code === AUTH_ERROR_CODES.ACCOUNT_DISABLED
          ? AUTH_ERROR_CODES.ACCOUNT_DISABLED
          : AUTH_ERROR_CODES.INVALID_CREDENTIALS;

      return {
        success: false,
        code,
        error: AUTH_ERROR_MESSAGES[code],
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      const authError = error as AuthError & { code?: string };
      const code =
        authError.code === AUTH_ERROR_CODES.ACCOUNT_DISABLED
          ? AUTH_ERROR_CODES.ACCOUNT_DISABLED
          : AUTH_ERROR_CODES.INVALID_CREDENTIALS;

      return {
        success: false,
        code,
        error: AUTH_ERROR_MESSAGES[code],
      };
    }

    return {
      success: false,
      code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      error: AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.INVALID_CREDENTIALS],
    };
  }

  redirect(callbackUrl);
}

export async function logoutAction(): Promise<void> {
  const session = await auth();
  if (session?.user?.id) {
    const context = await getLogContext(session.user.id, session.user.email ?? undefined);
    await trackActivity({
      userId: session.user.id,
      action: "LOGOUT",
      entityType: "SESSION",
      description: `Çıkış yapıldı: ${session.user.email}`,
      context,
    });
  }
  await signOut({ redirectTo: routes.auth.login });
}
