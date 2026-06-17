"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { BlogPostStatus } from "@prisma/client";

import { Button } from "@/components/shared";
import { routes } from "@/config/routes";
import { updateBlogPostStatusAction } from "../actions";
import { BLOG_DETAIL_TABS } from "../constants";
import type { BlogPostDetail } from "../types";
import { formatBlogDateTime, getAuthorDisplayName } from "../utils/blog-formatters";
import { BlogStatusBadge } from "./blog-status-badge";

interface BlogDetailTabsProps {
  post: BlogPostDetail;
  canUpdate: boolean;
  canPublish: boolean;
  activeTab?: string;
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export function BlogDetailTabs({
  post,
  canUpdate,
  canPublish,
  activeTab = "overview",
}: BlogDetailTabsProps) {
  const [isPending, startTransition] = useTransition();

  const setStatus = (status: BlogPostStatus) => {
    startTransition(async () => {
      await updateBlogPostStatusAction(post.id, status);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <BlogStatusBadge status={post.status} />
          {post.isFeatured ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Öne Çıkan
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" render={<Link href={routes.admin.blogPreview(post.id)} />}>
            Önizle
          </Button>
          {canUpdate ? (
            <Button render={<Link href={routes.admin.blogEdit(post.id)} />}>Düzenle</Button>
          ) : null}
          {canPublish && post.status !== "PUBLISHED" ? (
            <Button disabled={isPending} onClick={() => setStatus("PUBLISHED")}>
              Yayınla
            </Button>
          ) : null}
          {canPublish && post.status === "PUBLISHED" ? (
            <Button variant="outline" disabled={isPending} onClick={() => setStatus("ARCHIVED")}>
              Arşivle
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border">
        {BLOG_DETAIL_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={`${routes.admin.blogDetail(post.id)}?tab=${tab.id}`}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="grid gap-6 md:grid-cols-2">
          <DetailField label="Başlık" value={post.title} />
          <DetailField label="Slug" value={post.slug} />
          <DetailField label="Kategori" value={post.category?.name ?? "—"} />
          <DetailField
            label="Yazar"
            value={getAuthorDisplayName(post.author.name, post.author.email)}
          />
          <DetailField label="Yayın Tarihi" value={formatBlogDateTime(post.publishedAt)} />
          <DetailField label="Görüntülenme" value={post.viewCount.toLocaleString("tr-TR")} />
          <DetailField
            label="Etiketler"
            value={
              post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag.id} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                "—"
              )
            }
          />
          <DetailField label="Özet" value={post.excerpt ?? "—"} />
          {post.coverImage ? (
            <div className="md:col-span-2">
              <DetailField
                label="Kapak Görseli"
                value={
                  <div className="relative mt-2 aspect-[16/9] max-w-xl overflow-hidden rounded-lg border border-border">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 640px"
                    />
                  </div>
                }
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {activeTab === "content" ? (
        <article
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : null}

      {activeTab === "seo" ? (
        <div className="grid gap-6 md:grid-cols-2">
          <DetailField label="Meta Title" value={post.metaTitle ?? post.title} />
          <DetailField label="Meta Description" value={post.metaDescription ?? "—"} />
          <DetailField label="Anahtar Kelimeler" value={post.metaKeywords ?? "—"} />
          <DetailField label="Canonical URL" value={post.canonicalUrl ?? "—"} />
          <DetailField label="OG Image" value={post.ogImage ?? post.coverImage ?? "—"} />
        </div>
      ) : null}

      {activeTab === "analytics" ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
          İçerik analitiği entegrasyon noktası. Görüntülenme:{" "}
          <strong className="text-foreground">{post.viewCount}</strong>. Detaylı metrikler Faz 10
          kapsamında eklenecektir.
        </div>
      ) : null}
    </div>
  );
}
