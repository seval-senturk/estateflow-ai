import type { Metadata } from "next";
import { Suspense } from "react";

import { Breadcrumb } from "@/components/shared";
import { routes } from "@/config/routes";
import { BlogPostCard, PublicBlogToolbar } from "@/features/blog/components";
import { PUBLIC_BLOG_PAGE_SIZE } from "@/features/blog/constants";
import { blogService } from "@/features/blog/services";
import { buildPageMetadata } from "@/lib/seo";
import { blogBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBlogListJsonLd } from "@/features/website/lib/structured-data";

interface PublicBlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: PublicBlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = getParam(params, "category");
  const tagSlug = getParam(params, "tag");
  const search = getParam(params, "q");

  let title = "Blog";
  let description =
    "Emlak yatırımı, bölge analizleri, konut rehberi ve sektör trendleri hakkında uzman içerikler.";

  if (categorySlug) {
    const category = await blogService.getCategoryBySlug(categorySlug);
    if (category) {
      title = category.metaTitle ?? category.name;
      description = category.metaDescription ?? category.description ?? description;
    }
  }

  if (search) {
    title = `"${search}" arama sonuçları`;
  }

  return buildPageMetadata({
    title,
    description,
    canonicalPath: routes.public.blog,
    noIndex: Boolean(search || tagSlug),
  });
}

export default async function PublicBlogPage({ searchParams }: PublicBlogPageProps) {
  const params = await searchParams;
  const page = Number(getParam(params, "page") ?? "1");
  const search = getParam(params, "q");
  const categorySlug = getParam(params, "category");
  const tagSlug = getParam(params, "tag");

  const [result, lookup, activeCategory, activeTag] = await Promise.all([
    blogService.listPublished({
      search,
      categorySlug,
      tagSlug,
      page,
      pageSize: PUBLIC_BLOG_PAGE_SIZE,
    }),
    blogService.getLookupData(),
    categorySlug ? blogService.getCategoryBySlug(categorySlug) : null,
    tagSlug ? blogService.getTagBySlug(tagSlug) : null,
  ]);

  const breadcrumbs = blogBreadcrumb();
  const listJsonLd = buildBlogListJsonLd(result.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <header className="mb-10 max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {activeCategory?.name ?? activeTag?.name ?? "Blog"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {activeCategory?.description ??
              "Gayrimenkul yatırımı, piyasa analizleri ve yaşam rehberi içerikleri."}
          </p>
        </header>

        <Suspense fallback={null}>
          <PublicBlogToolbar
            categories={lookup.categories}
            page={result.page}
            totalPages={result.totalPages}
            activeCategorySlug={categorySlug}
            activeTagSlug={tagSlug}
          />
        </Suspense>

        {result.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Arama kriterlerinize uygun blog yazısı bulunamadı.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
