export function computeChanges(
  oldValues?: Record<string, unknown> | null,
  newValues?: Record<string, unknown> | null,
): Record<string, { from: unknown; to: unknown }> | undefined {
  if (!oldValues && !newValues) return undefined;

  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const keys = new Set([
    ...Object.keys(oldValues ?? {}),
    ...Object.keys(newValues ?? {}),
  ]);

  for (const key of keys) {
    const from = oldValues?.[key];
    const to = newValues?.[key];
    if (JSON.stringify(from) !== JSON.stringify(to)) {
      changes[key] = { from: from ?? null, to: to ?? null };
    }
  }

  return Object.keys(changes).length > 0 ? changes : undefined;
}

export function snapshotRecord<T extends Record<string, unknown>>(
  record: T,
  fields: (keyof T)[],
): Record<string, unknown> {
  return Object.fromEntries(
    fields.map((field) => [String(field), record[field] ?? null]),
  );
}
