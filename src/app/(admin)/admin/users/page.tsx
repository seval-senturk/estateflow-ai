import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminUsersPage() {
  await enforcePermission("users:read");

  return (
    <ModulePlaceholder
      title="Users"
      description="Manage team accounts, roles, and workspace access."
      moduleLabel="User management"
    />
  );
}
