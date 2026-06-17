import Link from "next/link";
import { Suspense } from "react";

import { LoadingState } from "@/components/admin/ui/loading-state";
import { PageHeader, Button } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { BlogListTable } from "@/features/blog/components";
import { blogService } from "@/features/blog/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface AdminBlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const user = await enforcePermission(permissions.blog.read);
  const params = await searchParams;

  const listResult = await blogService.list({
    search: getParam(params, "search"),
    status: getParam(params, "status") as "all" | "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
    categoryId: getParam(params, "categoryId"),
    authorId: getParam(params, "authorId"),
    page: Number(getParam(params, "page") ?? "1"),
    pageSize: Number(getParam(params, "pageSize") ?? "10"),
    sortBy: (getParam(params, "sortBy") as "createdAt" | "publishedAt" | "title" | "viewCount") ?? "createdAt",
    sortOrder: (getParam(params, "sortOrder") as "asc" | "desc") ?? "desc",
  });

  const lookup = await blogService.getLookupData();
  const canCreate = user.permissions.includes(permissions.blog.create);
  const canUpdate = user.permissions.includes(permissions.blog.update);
  const canDelete = user.permissions.includes(permissions.blog.delete);

  const result = listResult.success
    ? listResult.data
    : { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Yönetimi"
        description="Kurumsal içerik üretim akışınızı, yayın durumlarını ve SEO metadata alanlarını yönetin."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Blog" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" render={<Link href={routes.admin.blogCategories} />}>
              Kategoriler
            </Button>
            <Button variant="outline" render={<Link href={routes.admin.blogTags} />}>
              Etiketler
            </Button>
            {canCreate ? (
              <Button render={<Link href={routes.admin.blogCreate} />}>Yeni Yazı</Button>
            ) : null}
          </div>
        }
      />

      <Suspense fallback={<LoadingState label="Blog yazıları yükleniyor…" />}>
        <BlogListTable
          result={result}
          categories={lookup.categories}
          authors={lookup.authors.map((author) => ({
            id: author.id,
            name: author.name ?? author.email,
          }))}
          canCreate={canCreate}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </Suspense>
    </div>
  );
}
