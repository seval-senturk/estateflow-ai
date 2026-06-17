import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/shared";
import { routes } from "@/config/routes";
import {
  BlogContent,
  BlogPostCard,
  BlogTableOfContents,
  SocialShare,
} from "@/features/blog/components";
import { trackBlogView } from "@/features/blog/lib/blog-analytics";
import { blogService } from "@/features/blog/services";
import {
  addHeadingIds,
  extractTableOfContents,
  formatBlogDate,
  getAuthorDisplayName,
} from "@/features/blog/utils/blog-formatters";
import { buildPageMetadata } from "@/lib/seo";
import { blogPostBreadcrumb } from "@/lib/seo/breadcrumbs";
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
} from "@/features/website/lib/structured-data";

interface PublicBlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PublicBlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getPublishedBySlug(slug);

  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }

  return buildPageMetadata({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    keywords: post.metaKeywords,
    canonicalPath: routes.public.blogPost(post.slug),
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage ?? post.coverImage,
    ogType: "article",
    publishedTime: post.publishedAt?.toISOString(),
    authors: [getAuthorDisplayName(post.author.name, post.author.email)],
  });
}

export default async function PublicBlogDetailPage({ params }: PublicBlogDetailPageProps) {
  const { slug } = await params;
  const post = await blogService.getPublishedBySlug(slug);

  if (!post) {
    notFound();
  }

  await blogService.recordView(post.id);
  trackBlogView({
    postId: post.id,
    slug: post.slug,
    categorySlug: post.category?.slug,
  });

  const related = await blogService.getRelatedPosts(post.id, post.category?.id ?? null);
  const contentWithIds = addHeadingIds(post.content);
  const toc = extractTableOfContents(contentWithIds);
  const breadcrumbs = blogPostBreadcrumb(post.title, post.slug);
  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbListJsonLd(breadcrumbs);
  const authorName = getAuthorDisplayName(post.author.name, post.author.email);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-8">
            <header className="space-y-4">
              {post.category ? (
                <Link
                  href={routes.public.blogCategory(post.category.slug)}
                  className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {post.category.name}
                </Link>
              ) : null}
              <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
              {post.excerpt ? (
                <p className="text-xl text-muted-foreground">{post.excerpt}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>{authorName}</span>
                <time dateTime={post.publishedAt?.toISOString()}>
                  {formatBlogDate(post.publishedAt)}
                </time>
                <span>{post.viewCount.toLocaleString("tr-TR")} görüntülenme</span>
              </div>
            </header>

            {post.coverImage ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            ) : null}

            <BlogContent html={contentWithIds} />

            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={routes.public.blogTag(tag.slug)}
                    className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary/40"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            ) : null}

            <SocialShare
              url={routes.public.blogPost(post.slug)}
              title={post.title}
            />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <BlogTableOfContents items={toc} />
            <div className="rounded-xl border border-border p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Yazar
              </h2>
              <p className="font-medium text-foreground">{authorName}</p>
              <p className="text-sm text-muted-foreground">{post.author.email}</p>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="mb-6 text-2xl font-bold">Benzer Yazılar</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogPostCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
