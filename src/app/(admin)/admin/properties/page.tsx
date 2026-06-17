import Link from "next/link";
import { Suspense } from "react";

import { LoadingState } from "@/components/admin/ui/loading-state";
import { PageHeader, Button } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { PropertyListTable } from "@/features/properties/components";
import { propertyService } from "@/features/properties/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface AdminPropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  const user = await enforcePermission(permissions.properties.read);
  const params = await searchParams;

  const listResult = await propertyService.list({
    search: getParam(params, "search"),
    statusId: getParam(params, "statusId"),
    categoryId: getParam(params, "categoryId"),
    isPublished: getParam(params, "isPublished") as "all" | "published" | "draft" | undefined,
    createdFrom: getParam(params, "createdFrom"),
    createdTo: getParam(params, "createdTo"),
    page: Number(getParam(params, "page") ?? "1"),
    pageSize: Number(getParam(params, "pageSize") ?? "10"),
    sortBy: (getParam(params, "sortBy") as "createdAt" | "price" | "title") ?? "createdAt",
    sortOrder: (getParam(params, "sortOrder") as "asc" | "desc") ?? "desc",
  });

  const lookup = await propertyService.getLookupData();
  const canCreate = user.permissions.includes(permissions.properties.create);
  const canUpdate = user.permissions.includes(permissions.properties.update);
  const canDelete = user.permissions.includes(permissions.properties.delete);

  const result = listResult.success
    ? listResult.data
    : { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="İlan Yönetimi"
        description="İlan envanterinizi, yayın durumlarını ve metadata alanlarını tek merkezden yönetin."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "İlanlar" },
        ]}
        actions={
          canCreate ? (
            <Button render={<Link href={routes.admin.propertyCreate} />}>
              Yeni İlan
            </Button>
          ) : undefined
        }
      />

      <Suspense fallback={<LoadingState label="İlanlar yükleniyor…" />}>
        <PropertyListTable
          result={result}
          statuses={lookup.statuses.map((status) => ({
            id: status.id,
            name: status.name,
          }))}
          categories={lookup.categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
          canCreate={canCreate}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </Suspense>
    </div>
  );
}
