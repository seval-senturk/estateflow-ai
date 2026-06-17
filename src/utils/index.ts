export * from "./formatters";
export * from "./validators";
export * from "./slug";

export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize) || 1;
}

export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
