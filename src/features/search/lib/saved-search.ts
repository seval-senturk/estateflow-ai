import type { PublicPropertyFilters } from "@/features/properties/types";

import type { SavedSearchDraft } from "../types";

const STORAGE_KEY = "estateflow_saved_searches";

/** Client-side foundation for saved searches — full backend in a future phase. */
export const savedSearchStorage = {
  list(): SavedSearchDraft[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedSearchDraft[]) : [];
    } catch {
      return [];
    }
  },
  save(draft: SavedSearchDraft): SavedSearchDraft {
    const items = this.list();
    const entry: SavedSearchDraft = {
      ...draft,
      id: draft.id ?? crypto.randomUUID(),
      createdAt: draft.createdAt ?? new Date().toISOString(),
    };
    const next = [...items.filter((item) => item.id !== entry.id), entry];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return entry;
  },
  remove(id: string) {
    const next = this.list().filter((item) => item.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
  filtersToDraft(name: string, filters: PublicPropertyFilters): SavedSearchDraft {
    return { name, filters: { ...filters, page: 1 } };
  },
};
