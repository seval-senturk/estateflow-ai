import type { PaginatedResult, PaginationParams } from "@/types";

export abstract class BaseRepository {
  protected calculatePagination<T>(
    data: T[],
    total: number,
    params: PaginationParams,
  ): PaginatedResult<T> {
    return {
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize) || 1,
    };
  }
}
