"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { LOG_TABS, type LogTabId } from "../constants";

interface LogsTabsProps {
  activeTab: LogTabId;
}

export function LogsTabs({ activeTab }: LogsTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (tab: LogTabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
      {LOG_TABS.map((tab) => (
        <Link
          key={tab.id}
          href={buildHref(tab.id)}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
