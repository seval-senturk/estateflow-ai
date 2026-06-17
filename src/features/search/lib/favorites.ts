import type { FavoriteActionPayload } from "../types";

/** Foundation for favorites — integrate with PropertyFavorite API in a future phase. */
export const favoritesIntegration = {
  toggle(payload: FavoriteActionPayload) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[favorites-foundation]", payload);
    }
    return { success: false as const, reason: "not_implemented" as const };
  },
  isFavorite(propertyId: string) {
    void propertyId;
    return false;
  },
};
