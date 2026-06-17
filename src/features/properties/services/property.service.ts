import { ValidationError } from "@/lib/errors";
import { BaseService } from "@/services/base.service";
import type { AsyncActionResult } from "@/types";

import { PROPERTY_ERROR_CODES } from "../constants";
import { propertyRepository } from "../repositories";
import { propertyFormSchema, propertyListFiltersSchema } from "../schemas";
import type { PropertyFormInput, PropertyListFiltersInput } from "../schemas";
import type { PropertyDetail, PropertyListResult } from "../types";

export class PropertyService extends BaseService {
  async list(filters: PropertyListFiltersInput): AsyncActionResult<PropertyListResult> {
    try {
      const parsed = propertyListFiltersSchema.safeParse(filters);
      if (!parsed.success) {
        throw new ValidationError("Invalid property list filters");
      }

      const isPublished =
        parsed.data.isPublished === "published"
          ? true
          : parsed.data.isPublished === "draft"
            ? false
            : undefined;

      const result = await propertyRepository.findMany({
        search: parsed.data.search,
        statusId: parsed.data.statusId,
        categoryId: parsed.data.categoryId,
        isPublished,
        createdFrom: parsed.data.createdFrom,
        createdTo: parsed.data.createdTo,
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
        sortBy: parsed.data.sortBy,
        sortOrder: parsed.data.sortOrder,
      });

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): AsyncActionResult<PropertyDetail> {
    try {
      const property = await propertyRepository.findById(id);
      this.assertFound(property, "Property");
      return this.success(property);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPublishedBySlug(slug: string) {
    return propertyRepository.findBySlug(slug, true);
  }

  async listPublished(page = 1, pageSize = 12) {
    return propertyRepository.findPublicMany(page, pageSize);
  }

  async create(input: PropertyFormInput, userId: string): AsyncActionResult<{ id: string }> {
    try {
      const parsed = propertyFormSchema.parse(input);

      if (await propertyRepository.slugExists(parsed.slug)) {
        return this.fail("Bu slug zaten kullanılıyor", PROPERTY_ERROR_CODES.SLUG_CONFLICT);
      }

      const property = await propertyRepository.create(parsed, userId);
      return this.success({ id: property.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(
    id: string,
    input: PropertyFormInput,
    userId: string,
  ): AsyncActionResult<{ id: string }> {
    try {
      const existing = await propertyRepository.findById(id);
      this.assertFound(existing, "Property");

      const parsed = propertyFormSchema.parse(input);

      if (await propertyRepository.slugExists(parsed.slug, id)) {
        return this.fail("Bu slug zaten kullanılıyor", PROPERTY_ERROR_CODES.SLUG_CONFLICT);
      }

      await propertyRepository.update(id, parsed, userId);
      return this.success({ id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string, userId: string): AsyncActionResult<void> {
    try {
      const existing = await propertyRepository.findById(id);
      this.assertFound(existing, "Property");
      await propertyRepository.softDelete(id, userId);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateStatus(
    id: string,
    statusId: string,
    userId: string,
  ): AsyncActionResult<{ id: string }> {
    try {
      const existing = await propertyRepository.findById(id);
      this.assertFound(existing, "Property");
      await propertyRepository.updateStatus(id, statusId, userId);
      return this.success({ id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLookupData() {
    return propertyRepository.getLookupData();
  }
}

export const propertyService = new PropertyService();
