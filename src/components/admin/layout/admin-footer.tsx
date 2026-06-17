import { appConfig } from "@/config/app";

export function AdminFooter() {
  return (
    <footer className="border-t border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {appConfig.name}. Internal operations workspace.
        </p>
        <p>Authorized access only</p>
      </div>
    </footer>
  );
}
