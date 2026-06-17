import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, Button } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { PropertyForm } from "@/features/properties/components";
import { propertyService } from "@/features/properties/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  await enforcePermission(permissions.properties.update);
  const { id } = await params;

  const [propertyResult, lookup] = await Promise.all([
    propertyService.getById(id),
    propertyService.getLookupData(),
  ]);

  if (!propertyResult.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="İlanı Düzenle"
        description={propertyResult.data.title}
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "İlanlar", href: routes.admin.properties },
          { label: propertyResult.data.title, href: routes.admin.propertyDetail(id) },
          { label: "Düzenle" },
        ]}
        actions={
          <Button
            variant="outline"
            render={<Link href={routes.admin.propertyDetail(id)} />}
          >
            Detaya Dön
          </Button>
        }
      />
      <PropertyForm mode="edit" lookup={lookup} property={propertyResult.data} />
    </div>
  );
}
