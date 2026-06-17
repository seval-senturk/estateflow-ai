import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { BlogCategoryManager } from "@/features/blog/components";
import { blogService } from "@/features/blog/services";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function BlogCategoriesPage() {
  await enforcePermission(permissions.blog.read);
  const categories = await blogService.listCategories();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Kategorileri"
        description="İçerik sınıflandırması ve kategori SEO alanlarını yönetin."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Blog", href: routes.admin.blog },
          { label: "Kategoriler" },
        ]}
      />
      <BlogCategoryManager categories={categories} />
    </div>
  );
}
