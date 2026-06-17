import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components";
import { appConfig } from "@/config/app";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to the ${appConfig.name} administration workspace`,
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Sign in to manage listings, content, and team operations from your
          workspace.
        </p>
      </div>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-xs text-muted-foreground">
        Authorized personnel only. Activity is monitored for security purposes.
      </p>
    </div>
  );
}
