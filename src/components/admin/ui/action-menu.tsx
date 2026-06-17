"use client";

import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  onSelect: (value: string) => void;
  className?: string;
}

export function ActionMenu({ items, onSelect, className }: ActionMenuProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) => (
        <Button
          key={item.value}
          type="button"
          size="sm"
          variant="outline"
          disabled={item.disabled}
          onClick={() => onSelect(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
