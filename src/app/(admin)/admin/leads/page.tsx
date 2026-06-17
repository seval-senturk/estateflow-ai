import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminLeadsPage() {
  await enforcePermission("leads:read");

  return (
    <ModulePlaceholder
      title="Leads"
      description="Track inbound inquiries, assignment workflow, and conversion status."
      moduleLabel="Lead management"
    />
  );
}
