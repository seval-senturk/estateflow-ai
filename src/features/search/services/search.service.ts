import { propertyRepository } from "@/features/properties/repositories";
import type { PublicPropertyFilters } from "@/features/properties/types";

import { searchRepository } from "../repositories/search.repository";

export class SearchService {
  async search(filters: PublicPropertyFilters = {}) {
    return propertyRepository.findPublicMany(filters);
  }

  async getFilterOptions(city?: string) {
    return searchRepository.getPublicFilterOptions(city);
  }
}

export const searchService = new SearchService();
