import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminPropertiesPage() {
  await enforcePermission("properties:read");

  return (
    <ModulePlaceholder
      title="Properties"
      description="Manage listing inventory, publication status, and property metadata."
      moduleLabel="Property management"
    />
  );
}
