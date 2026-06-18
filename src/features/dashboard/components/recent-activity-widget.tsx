import Link from "next/link";

import { DataCard } from "@/components/admin/ui/data-card";
import { routes } from "@/config/routes";
import { ACTIVITY_ACTION_LABELS } from "@/features/logs/constants";
import type { ActivityLogEntry } from "@/types/logging";

interface RecentActivityWidgetProps {
  activities: ActivityLogEntry[];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
  return (
    <DataCard
      title="Son Aktiviteler"
      description="Workspace olayları ve audit kayıtları"
      footer={
        <Link href={routes.admin.logs} className="text-primary hover:underline">
          Tüm loglar →
        </Link>
      }
    >
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz aktivite kaydı yok.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {ACTIVITY_ACTION_LABELS[activity.action] ?? activity.action}
                  {activity.userEmail ? ` · ${activity.userEmail}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(activity.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DataCard>
  );
}
