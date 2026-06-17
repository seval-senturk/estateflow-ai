import { cn } from "@/lib/utils";

import { Search } from "@/components/shared";

interface FilterBarProps {
  searchValue?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearch,
  searchPlaceholder = "Search records…",
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {onSearch ? (
        <Search
          value={searchValue}
          onSearch={onSearch}
          placeholder={searchPlaceholder}
          className="w-full sm:max-w-sm"
        />
      ) : null}
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
