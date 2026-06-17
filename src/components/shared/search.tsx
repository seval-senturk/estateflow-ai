"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Input as UiInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchProps {
  value?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function Search({
  value,
  defaultValue = "",
  onSearch,
  placeholder = "Search…",
  debounceMs = 300,
  className,
}: SearchProps) {
  const [query, setQuery] = useState(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <UiInput
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {query ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
