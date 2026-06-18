import { AUDIT_ACTION_LABELS } from "@/features/audit/constants";
import type { AuditLogEntry } from "@/types/logging";

interface EntityHistoryPanelProps {
  title?: string;
  entries: AuditLogEntry[];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function EntityHistoryPanel({ title = "Değişiklik Geçmişi", entries }: EntityHistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Henüz audit kaydı bulunmuyor.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-medium">{title}</h2>
      <ol className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="border-l border-border pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">
                {AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.userName ?? entry.userEmail ?? "Sistem"}
            </p>
            {entry.changes && Object.keys(entry.changes).length > 0 ? (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {Object.entries(entry.changes).map(([field, change]) => (
                  <li key={field}>
                    <span className="font-medium text-foreground">{field}:</span>{" "}
                    {String(change.from ?? "—")} → {String(change.to ?? "—")}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
