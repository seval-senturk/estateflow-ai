import { EmptyState } from "@/components/admin/ui/empty-state";
import { PageHeader } from "@/components/shared";
import type { Permission } from "@/config/permissions";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  moduleLabel: string;
  permission?: Permission;
}

export function ModulePlaceholder({
  title,
  description,
  moduleLabel,
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        title={`${moduleLabel} module coming soon`}
        description="This workspace section is scaffolded and permission-protected. Business workflows will be added in the next development phase."
      />
    </div>
  );
}
