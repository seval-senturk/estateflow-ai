import Link from "next/link";

import { routes } from "@/config/routes";
import { Button, Input, PageHeader } from "@/components/shared";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Sign in"
        description="Access your EstateFlow workspace"
      />

      <form className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={routes.public.home}
          className="font-medium text-primary hover:underline"
        >
          Return to website
        </Link>
      </p>
    </div>
  );
}
