import { cn } from "@/lib/utils";

interface FormLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function FormLayout({ children, sidebar, className }: FormLayoutProps) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]",
        className,
      )}
    >
      <div className="space-y-6">{children}</div>
      {sidebar ? <aside className="space-y-4">{sidebar}</aside> : null}
    </div>
  );
}
