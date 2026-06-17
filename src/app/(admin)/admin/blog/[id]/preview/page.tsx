import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { BlogContent } from "@/features/blog/components";
import { blogService } from "@/features/blog/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface BlogPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPreviewPage({ params }: BlogPreviewPageProps) {
  await enforcePermission(permissions.blog.read);
  const { id } = await params;

  const result = await blogService.getById(id);
  if (!result.success) {
    notFound();
  }

  const post = result.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Önizleme: ${post.title}`}
        description="Yayın öncesi içerik önizlemesi"
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Blog", href: routes.admin.blog },
          { label: post.title, href: routes.admin.blogDetail(id) },
          { label: "Önizleme" },
        ]}
      />
      <article className="mx-auto max-w-3xl space-y-6 rounded-xl border border-border bg-card p-8">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">{post.category?.name ?? "Kategori yok"}</p>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          {post.excerpt ? <p className="text-lg text-muted-foreground">{post.excerpt}</p> : null}
        </header>
        <BlogContent html={post.content} />
      </article>
    </div>
  );
}
