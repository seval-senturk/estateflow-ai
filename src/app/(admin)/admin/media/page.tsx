import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminMediaPage() {
  await enforcePermission("media:read");

  return (
    <ModulePlaceholder
      title="Media Library"
      description="Organize uploaded assets, folders, and media usage across modules."
      moduleLabel="Media library"
    />
  );
}
