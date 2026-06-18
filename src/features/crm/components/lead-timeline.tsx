"use client";

import { formatLeadDate, getLeadFullName, getLeadSourceLabel } from "../utils/lead-formatters";
import type { LeadActivityItem, LeadNoteItem } from "../types";
import { LEAD_ACTIVITY_LABELS } from "../constants";

interface TimelineEntry {
  id: string;
  type: "note" | "activity";
  title: string;
  description?: string | null;
  actor?: string | null;
  createdAt: Date;
}

interface LeadTimelineProps {
  notes: LeadNoteItem[];
  activities: LeadActivityItem[];
}

function buildTimeline(notes: LeadNoteItem[], activities: LeadActivityItem[]): TimelineEntry[] {
  const noteEntries: TimelineEntry[] = notes.map((note) => ({
    id: `note-${note.id}`,
    type: "note",
    title: "Not",
    description: note.content,
    actor: note.author?.name ?? note.author?.email ?? null,
    createdAt: new Date(note.createdAt),
  }));

  const activityEntries: TimelineEntry[] = activities.map((activity) => ({
    id: `activity-${activity.id}`,
    type: "activity",
    title: activity.title || LEAD_ACTIVITY_LABELS[activity.type] || activity.type,
    description: activity.description,
    actor: activity.actor?.name ?? activity.actor?.email ?? null,
    createdAt: new Date(activity.createdAt),
  }));

  return [...noteEntries, ...activityEntries].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export function LeadTimeline({ notes, activities }: LeadTimelineProps) {
  const entries = buildTimeline(notes, activities);

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz zaman çizelgesi kaydı yok.</p>;
  }

  return (
    <ol className="space-y-4">
      {entries.map((entry) => (
        <li key={entry.id} className="relative border-l border-border pl-4">
          <div className="absolute -left-1.5 top-1 size-3 rounded-full bg-primary" />
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{entry.title}</p>
            <span className="text-xs text-muted-foreground">{formatLeadDate(entry.createdAt)}</span>
          </div>
          {entry.description ? <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p> : null}
          {entry.actor ? <p className="mt-1 text-xs text-muted-foreground">{entry.actor}</p> : null}
        </li>
      ))}
    </ol>
  );
}

export { getLeadFullName, getLeadSourceLabel };
