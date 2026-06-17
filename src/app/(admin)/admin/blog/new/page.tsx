import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { BlogForm } from "@/features/blog/components";
import { blogService } from "@/features/blog/services";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function CreateBlogPage() {
  const user = await enforcePermission(permissions.blog.create);
  const lookup = await blogService.getLookupData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yeni Blog Yazısı"
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Blog", href: routes.admin.blog },
          { label: "Yeni Yazı" },
        ]}
      />
      <BlogForm mode="create" lookup={lookup} currentUserId={user.id} />
    </div>
  );
}
