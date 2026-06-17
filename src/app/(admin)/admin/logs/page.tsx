import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminLogsPage() {
  await enforcePermission("logs:read");

  return (
    <ModulePlaceholder
      title="Activity Logs"
      description="Review audit events, login history, and operational activity."
      moduleLabel="Activity logs"
    />
  );
}
