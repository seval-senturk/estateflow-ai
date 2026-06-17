import Link from "next/link";

import { Button } from "@/components/shared";
import { routes } from "@/config/routes";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          404
        </p>
        <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button render={<Link href={routes.public.home} />}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
