import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, Button } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { BlogDetailTabs } from "@/features/blog/components";
import { blogService } from "@/features/blog/services";
import { EntityHistoryPanel } from "@/features/audit/components";
import { auditService } from "@/features/audit/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogDetailPage({ params, searchParams }: BlogDetailPageProps) {
  const user = await enforcePermission(permissions.blog.read);
  const { id } = await params;
  const query = await searchParams;
  const tab = typeof query.tab === "string" ? query.tab : "overview";

  const [result, auditHistory] = await Promise.all([
    blogService.getById(id),
    auditService.getEntityHistory("BLOG_POST", id),
  ]);
  if (!result.success) {
    notFound();
  }

  const post = result.data;
  const canUpdate = user.permissions.includes(permissions.blog.update);
  const canPublish = user.permissions.includes(permissions.blog.publish);

  return (
    <div className="space-y-6">
      <PageHeader
        title={post.title}
        description={post.excerpt ?? "Blog yazısı detayları"}
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Blog", href: routes.admin.blog },
          { label: post.title },
        ]}
        actions={
          canUpdate ? (
            <Button render={<Link href={routes.admin.blogEdit(post.id)} />}>Düzenle</Button>
          ) : undefined
        }
      />
      <BlogDetailTabs
        post={post}
        canUpdate={canUpdate}
        canPublish={canPublish}
        activeTab={tab}
      />
      <EntityHistoryPanel title="Blog Geçmişi" entries={auditHistory} />
    </div>
  );
}
