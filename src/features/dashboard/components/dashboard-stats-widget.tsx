import {
  Building2,
  FileText,
  PauseCircle,
  UserRound,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/shared";
import type { DashboardStats } from "@/features/dashboard/types";

interface DashboardStatsWidgetProps {
  stats: DashboardStats;
}

export function DashboardStatsWidget({ stats }: DashboardStatsWidgetProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Toplam İlan"
        value={stats.totalProperties}
        icon={<Building2 className="size-5" />}
      />
      <StatCard
        label="Aktif İlan"
        value={stats.activeProperties}
        icon={<Building2 className="size-5" />}
      />
      <StatCard
        label="Pasif İlan"
        value={stats.inactiveProperties}
        icon={<PauseCircle className="size-5" />}
      />
      <StatCard
        label="Toplam Lead"
        value={stats.totalLeads}
        icon={<UserRound className="size-5" />}
      />
      <StatCard
        label="Blog Yazıları"
        value={stats.totalBlogPosts}
        icon={<FileText className="size-5" />}
      />
      <StatCard
        label="Kullanıcı Sayısı"
        value={stats.totalUsers}
        icon={<Users className="size-5" />}
      />
    </div>
  );
}
