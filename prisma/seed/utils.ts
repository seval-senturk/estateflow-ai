import type { PrismaClient } from "@prisma/client";

const SOFT_DELETE_MODELS = new Set(["propertyCategory", "blogCategory", "blogTag", "mediaFolder"]);

type UpsertModel =
  | "propertyCategory"
  | "blogCategory"
  | "blogTag"
  | "propertyStatus"
  | "propertyFeature"
  | "leadStatus"
  | "mediaFolder"
  | "role"
  | "permission";

/**
 * Upserts a record located by slug among active (non-deleted) rows.
 * Supports soft-delete slug strategy with partial unique indexes.
 */
export async function upsertActiveBySlug<TData extends { slug: string; name: string }>(
  prisma: PrismaClient,
  model: UpsertModel,
  slug: string,
  data: TData,
) {
  const delegate = prisma[model] as {
    findFirst: (args: { where: Record<string, unknown> }) => Promise<{ id: string } | null>;
    update: (args: { where: { id: string }; data: TData }) => Promise<unknown>;
    create: (args: { data: TData }) => Promise<unknown>;
  };

  const where: Record<string, unknown> = { slug };
  if (SOFT_DELETE_MODELS.has(model)) {
    where.deletedAt = null;
  }

  const existing = await delegate.findFirst({ where });

  if (existing) {
    return delegate.update({ where: { id: existing.id }, data });
  }

  return delegate.create({ data });
}
