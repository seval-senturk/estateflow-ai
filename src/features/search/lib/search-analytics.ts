import type { SearchAnalyticsEvent } from "../types";

/** Foundation hook — wire to analytics provider in a future phase. */
export function trackSearchEvent(event: Omit<SearchAnalyticsEvent, "timestamp">) {
  if (process.env.NODE_ENV === "development") {
    console.debug("[search-analytics]", { ...event, timestamp: new Date().toISOString() });
  }
}

export const searchAnalytics = {
  trackSearch(filters: SearchAnalyticsEvent["filters"], resultCount: number) {
    trackSearchEvent({ type: "search", filters, resultCount });
  },
  trackFilterApply(filters: SearchAnalyticsEvent["filters"]) {
    trackSearchEvent({ type: "filter_apply", filters });
  },
  trackSortChange(filters: SearchAnalyticsEvent["filters"]) {
    trackSearchEvent({ type: "sort_change", filters });
  },
  trackMapToggle() {
    trackSearchEvent({ type: "map_toggle" });
  },
  trackEmptyResults(filters: SearchAnalyticsEvent["filters"]) {
    trackSearchEvent({ type: "empty_results", filters, resultCount: 0 });
  },
};
