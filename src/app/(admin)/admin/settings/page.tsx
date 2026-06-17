import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminSettingsPage() {
  await enforcePermission("settings:read");

  return (
    <ModulePlaceholder
      title="Settings"
      description="Configure company profile, communication, and platform defaults."
      moduleLabel="Settings"
    />
  );
}
