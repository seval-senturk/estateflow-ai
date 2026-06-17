import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, Button } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { PropertyDetailTabs } from "@/features/properties/components";
import { propertyMediaService } from "@/features/media/services";
import { propertyService } from "@/features/properties/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const user = await enforcePermission(permissions.properties.read);
  const { id } = await params;

  const [propertyResult, lookup, mediaResult] = await Promise.all([
    propertyService.getById(id),
    propertyService.getLookupData(),
    propertyMediaService.getPropertyMedia(id),
  ]);

  if (!propertyResult.success) {
    notFound();
  }

  const canUpdate = user.permissions.includes(permissions.properties.update);

  return (
    <div className="space-y-6">
      <PageHeader
        title="İlan Detayı"
        description="İlan bilgilerini sekmeler halinde görüntüleyin ve durumunu yönetin."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "İlanlar", href: routes.admin.properties },
          { label: propertyResult.data.title },
        ]}
        actions={
          canUpdate ? (
            <Button render={<Link href={routes.admin.propertyEdit(id)} />}>
              Düzenle
            </Button>
          ) : undefined
        }
      />
      <PropertyDetailTabs
        property={propertyResult.data}
        propertyMedia={mediaResult.success ? mediaResult.data : { images: [], videos: [] }}
        statuses={lookup.statuses.map((status) => ({
          id: status.id,
          name: status.name,
        }))}
        canUpdate={canUpdate}
      />
    </div>
  );
}
