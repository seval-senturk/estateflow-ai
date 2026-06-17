import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, Button } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { PropertyForm } from "@/features/properties/components";
import { propertyService } from "@/features/properties/services";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function CreatePropertyPage() {
  await enforcePermission(permissions.properties.create);
  const lookup = await propertyService.getLookupData();

  if (!lookup.statuses.length) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yeni İlan Oluştur"
        description="İlan bilgilerini bölümler halinde doldurun ve kaydedin."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "İlanlar", href: routes.admin.properties },
          { label: "Yeni İlan" },
        ]}
        actions={
          <Button variant="outline" render={<Link href={routes.admin.properties} />}>
            Listeye Dön
          </Button>
        }
      />
      <PropertyForm mode="create" lookup={lookup} />
    </div>
  );
}
