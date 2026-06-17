import Link from "next/link";

import { routes } from "@/config/routes";
import { Button } from "@/components/shared";
import { AdminUserMenu } from "./admin-user-menu";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Workspace
        </p>
        <p className="text-sm font-medium">Management Console</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" render={<Link href={routes.public.home} />}>
          View Site
        </Button>
        <AdminUserMenu />
      </div>
    </header>
  );
}
