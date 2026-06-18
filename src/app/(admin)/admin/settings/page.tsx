import { PageHeader } from "@/components/shared";
import { AiSettingsPanel } from "@/features/ai/components/ai-settings-panel";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function AdminSettingsPage() {
  await enforcePermission("settings:read");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Platform yapılandırması ve AI servis durumu."
      />
      <AiSettingsPanel />
    </div>
  );
}
