import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { BlogForm } from "@/features/blog/components";
import { blogService } from "@/features/blog/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const user = await enforcePermission(permissions.blog.update);
  const { id } = await params;

  const [postResult, lookup] = await Promise.all([
    blogService.getById(id),
    blogService.getLookupData(),
  ]);

  if (!postResult.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Yazısını Düzenle"
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Blog", href: routes.admin.blog },
          { label: postResult.data.title, href: routes.admin.blogDetail(id) },
          { label: "Düzenle" },
        ]}
      />
      <BlogForm
        mode="edit"
        lookup={lookup}
        post={postResult.data}
        currentUserId={user.id}
      />
    </div>
  );
}
