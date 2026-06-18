import Link from "next/link";

import { DataCard } from "@/components/admin/ui/data-card";
import { InfoCard } from "@/components/admin/ui/info-card";
import { routes } from "@/config/routes";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants";
import type { CrmDashboardStats } from "@/features/crm/types";

interface LeadSummaryWidgetProps {
  stats: CrmDashboardStats;
}

export function LeadSummaryWidget({ stats }: LeadSummaryWidgetProps) {
  return (
    <DataCard
      title="Lead Özeti"
      description="Pipeline dağılımı ve güncel lead metrikleri"
      footer={
        <Link href={routes.admin.leads} className="text-primary hover:underline">
          Tüm leadler →
        </Link>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Yeni (7 gün)" value={String(stats.newLeads)} hint="Son hafta oluşturulan" />
        <InfoCard label="Bu Ay Kazanılan" value={String(stats.wonThisMonth)} hint="Dönüştürülen leadler" />
        <InfoCard label="Bekleyen" value={String(stats.pendingLeads)} hint="Aktif takipte" />
        <InfoCard
          label="Toplam Durum"
          value={String(stats.byStatus.reduce((sum, row) => sum + row.count, 0))}
          hint="Tüm pipeline"
        />
      </div>
    </DataCard>
  );
}

interface CrmAgentPerformanceWidgetProps {
  stats: CrmDashboardStats;
}

export function CrmAgentPerformanceWidget({ stats }: CrmAgentPerformanceWidgetProps) {
  return (
    <DataCard title="Danışman Performansı" description="Atanan lead sayıları">
      {stats.agentPerformance.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz atanmış lead yok.</p>
      ) : (
        <ul className="space-y-2">
          {stats.agentPerformance.slice(0, 5).map((row) => (
            <li key={row.agentId} className="flex items-center justify-between text-sm">
              <span>{row.agentName}</span>
              <span className="font-medium">{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </DataCard>
  );
}

interface CrmSourceWidgetProps {
  stats: CrmDashboardStats;
}

export function CrmSourceWidget({ stats }: CrmSourceWidgetProps) {
  return (
    <DataCard title="Lead Kaynakları" description="Kaynak bazlı dağılım">
      {stats.bySource.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz lead kaydı yok.</p>
      ) : (
        <ul className="space-y-2">
          {stats.bySource.map((row) => (
            <li key={row.source} className="flex items-center justify-between text-sm">
              <span>{LEAD_SOURCE_LABELS[row.source]}</span>
              <span className="font-medium">{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </DataCard>
  );
}
