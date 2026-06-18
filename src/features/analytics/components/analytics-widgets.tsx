import Link from "next/link";

import { DataCard } from "@/components/admin/ui/data-card";
import { InfoCard } from "@/components/admin/ui/info-card";
import { routes } from "@/config/routes";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants";
import type { AnalyticsSnapshot } from "../types";

interface PropertyAnalyticsWidgetProps {
  data: AnalyticsSnapshot["property"];
}

export function PropertyAnalyticsWidget({ data }: PropertyAnalyticsWidgetProps) {
  return (
    <DataCard title="İlan Analitiği" description="İlan envanteri özeti">
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Toplam" value={String(data.total)} />
        <InfoCard label="Aktif" value={String(data.active)} />
        <InfoCard label="Pasif" value={String(data.inactive)} />
        <InfoCard label="Yayında" value={String(data.published)} />
      </div>
    </DataCard>
  );
}

interface CrmAnalyticsWidgetProps {
  data: AnalyticsSnapshot["crm"];
}

export function CrmAnalyticsWidget({ data }: CrmAnalyticsWidgetProps) {
  return (
    <DataCard
      title="CRM Analitiği"
      description="Lead pipeline metrikleri"
      footer={<Link href={routes.admin.leads} className="text-primary hover:underline">Lead yönetimi →</Link>}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Yeni (bu ay)" value={String(data.newThisMonth)} />
        <InfoCard label="Açık" value={String(data.open)} />
        <InfoCard label="Kazanılan" value={String(data.won)} />
        <InfoCard label="Kaybedilen" value={String(data.lost)} />
      </div>
      {data.bySource.length > 0 ? (
        <ul className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
          {data.bySource.slice(0, 4).map((row) => (
            <li key={row.source} className="flex justify-between">
              <span className="text-muted-foreground">{LEAD_SOURCE_LABELS[row.source]}</span>
              <span>{row.count}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </DataCard>
  );
}

interface ContentAnalyticsWidgetProps {
  data: AnalyticsSnapshot["content"];
}

export function ContentAnalyticsWidget({ data }: ContentAnalyticsWidgetProps) {
  return (
    <DataCard title="İçerik Analitiği" description="Blog yayın metrikleri">
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Toplam Blog" value={String(data.totalPosts)} />
        <InfoCard label="Yayınlanan" value={String(data.publishedPosts)} />
      </div>
    </DataCard>
  );
}

interface SystemAnalyticsWidgetProps {
  data: AnalyticsSnapshot["system"];
}

export function SystemAnalyticsWidget({ data }: SystemAnalyticsWidgetProps) {
  return (
    <DataCard title="Sistem Analitiği" description="Kullanıcı ve aktivite özeti">
      <InfoCard label="Aktif Kullanıcılar" value={String(data.activeUsers)} />
      <div className="mb-4" />
      <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Son Girişler</p>
      <ul className="space-y-1 text-sm">
        {data.recentLogins.map((login, index) => (
          <li key={`${login.email}-${index}`} className="flex justify-between gap-2">
            <span className="truncate">{login.email}</span>
            <span className="text-muted-foreground">{login.result}</span>
          </li>
        ))}
      </ul>
    </DataCard>
  );
}
