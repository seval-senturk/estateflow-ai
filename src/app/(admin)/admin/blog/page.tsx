import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminBlogPage() {
  await enforcePermission("blog:read");

  return (
    <ModulePlaceholder
      title="Blog"
      description="Plan editorial content, categories, and publication workflow."
      moduleLabel="Blog"
    />
  );
}
