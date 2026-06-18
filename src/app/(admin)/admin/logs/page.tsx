import { Suspense } from "react";

import { LoadingState } from "@/components/admin/ui/loading-state";
import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import {
  ActivityLogTable,
  AuditLogTable,
  LoginHistoryTable,
  LogsTabs,
} from "@/features/logs/components";
import { LOG_TABS, type LogTabId } from "@/features/logs/constants";
import type { LogListFiltersInput } from "@/features/logs/schemas";
import { logsService } from "@/features/logs/services";
import { auditService } from "@/features/audit/services";
import { activeOnly, prisma } from "@/lib/database";
import { enforcePermission } from "@/lib/authorization/guards";

interface AdminLogsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function resolveTab(value: string | undefined): LogTabId {
  const match = LOG_TABS.find((tab) => tab.id === value);
  return match?.id ?? "activity";
}

export default async function AdminLogsPage({ searchParams }: AdminLogsPageProps) {
  await enforcePermission(permissions.logs.read);
  const params = await searchParams;
  const tab = resolveTab(getParam(params, "tab"));

  const filters = {
    search: getParam(params, "search"),
    userId: getParam(params, "userId"),
    action: getParam(params, "action") as LogListFiltersInput["action"],
    entityType: getParam(params, "entityType"),
    result: getParam(params, "result") as LogListFiltersInput["result"],
    page: Number(getParam(params, "page") ?? "1"),
    pageSize: Number(getParam(params, "pageSize") ?? "20"),
  } satisfies LogListFiltersInput;

  const [users, activityResult, auditResult, loginResult] = await Promise.all([
    prisma.user.findMany({
      where: { ...activeOnly, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
    tab === "activity" ? logsService.listActivity(filters) : Promise.resolve(null),
    tab === "audit" ? auditService.list(filters) : Promise.resolve(null),
    tab === "login" ? logsService.listLoginHistory(filters) : Promise.resolve(null),
  ]);

  const userOptions = users.map((user) => ({
    id: user.id,
    name: user.name ?? user.email,
  }));

  const emptyResult = { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Sistem aktivitelerini, audit trail kayıtlarını ve giriş geçmişini inceleyin."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Logs" },
        ]}
      />

      <LogsTabs activeTab={tab} />

      <Suspense fallback={<LoadingState label="Loglar yükleniyor…" />}>
        {tab === "activity" ? (
          <ActivityLogTable
            result={activityResult?.success ? activityResult.data : emptyResult}
            users={userOptions}
          />
        ) : null}
        {tab === "audit" ? (
          <AuditLogTable
            result={auditResult?.success ? auditResult.data : emptyResult}
            users={userOptions}
          />
        ) : null}
        {tab === "login" ? (
          <LoginHistoryTable
            result={loginResult?.success ? loginResult.data : emptyResult}
          />
        ) : null}
      </Suspense>
    </div>
  );
}
