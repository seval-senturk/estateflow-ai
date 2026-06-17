import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { BlogTagManager } from "@/features/blog/components";
import { blogService } from "@/features/blog/services";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function BlogTagsPage() {
  await enforcePermission(permissions.blog.read);
  const tags = await blogService.listTags();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Etiketleri"
        description="Dinamik etiket yönetimi ile içerik keşfedilebilirliğini artırın."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Blog", href: routes.admin.blog },
          { label: "Etiketler" },
        ]}
      />
      <BlogTagManager tags={tags} />
    </div>
  );
}
