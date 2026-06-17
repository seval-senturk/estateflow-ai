"use client";

import { useAuth } from "@/features/auth/hooks";
import { logoutAction } from "@/features/auth/actions";
import { roleLabels } from "@/config/roles";
import { Button } from "@/components/shared";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdminUserMenu() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />;
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
      </div>

      <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {getInitials(user.name)}
      </div>

      <form action={logoutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
