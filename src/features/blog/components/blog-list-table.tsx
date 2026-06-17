"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/admin/ui/empty-state";
import { LoadingState } from "@/components/admin/ui/loading-state";
import {
  Button,
  DataTable,
  type DataTableColumn,
  Pagination,
  Search,
  Select,
} from "@/components/shared";
import { routes } from "@/config/routes";
import { BLOG_POST_STATUS_LABELS } from "../constants";
import { deleteBlogPostAction } from "../actions";
import type { BlogPostListItem, BlogPostListResult } from "../types";
import { formatBlogDateTime } from "../utils/blog-formatters";
import { BlogStatusBadge } from "./blog-status-badge";

interface LookupOption {
  id: string;
  name: string;
}

interface BlogListTableProps {
  result: BlogPostListResult;
  categories: LookupOption[];
  authors: LookupOption[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  isLoading?: boolean;
}

export function BlogListTable({
  result,
  categories,
  authors,
  canCreate,
  canUpdate,
  canDelete,
  isLoading = false,
}: BlogListTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const columns: DataTableColumn<BlogPostListItem>[] = [
    {
      key: "title",
      header: "Başlık",
      cell: (post) => (
        <div className="space-y-1">
          <p className="font-medium text-foreground">{post.title}</p>
          <p className="text-xs text-muted-foreground">{post.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      cell: (post) => post.categoryName ?? "—",
    },
    {
      key: "author",
      header: "Yazar",
      cell: (post) => post.authorName ?? "—",
    },
    {
      key: "status",
      header: "Durum",
      cell: (post) => <BlogStatusBadge status={post.status} />,
    },
    {
      key: "publishedAt",
      header: "Yayın",
      cell: (post) => formatBlogDateTime(post.publishedAt),
    },
    {
      key: "views",
      header: "Görüntülenme",
      cell: (post) => post.viewCount.toLocaleString("tr-TR"),
    },
    {
      key: "actions",
      header: "İşlemler",
      cell: (post) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href={routes.admin.blogDetail(post.id)} aria-label="Görüntüle" />}
          >
            <Eye className="size-4" />
          </Button>
          {canUpdate ? (
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href={routes.admin.blogEdit(post.id)} aria-label="Düzenle" />}
            >
              <Pencil className="size-4" />
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                if (!window.confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
                startTransition(async () => {
                  await deleteBlogPostAction(post.id);
                });
              }}
              aria-label="Sil"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState label="Blog yazıları yükleniyor…" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Search
          placeholder="Başlık veya slug ara…"
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => updateParams({ search: value || undefined })}
        />
        <div className="flex flex-wrap gap-2">
          <Select
            placeholder="Durum"
            value={searchParams.get("status") ?? "all"}
            onValueChange={(value) =>
              updateParams({ status: !value || value === "all" ? undefined : value })
            }
            options={[
              { value: "all", label: "Tüm durumlar" },
              ...Object.entries(BLOG_POST_STATUS_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
          <Select
            placeholder="Kategori"
            value={searchParams.get("categoryId") ?? ""}
            onValueChange={(value) => updateParams({ categoryId: value || undefined })}
            options={[
              { value: "", label: "Tüm kategoriler" },
              ...categories.map((category) => ({ value: category.id, label: category.name })),
            ]}
          />
          <Select
            placeholder="Yazar"
            value={searchParams.get("authorId") ?? ""}
            onValueChange={(value) => updateParams({ authorId: value || undefined })}
            options={[
              { value: "", label: "Tüm yazarlar" },
              ...authors.map((author) => ({ value: author.id, label: author.name })),
            ]}
          />
        </div>
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="Blog yazısı bulunamadı"
          description={
            canCreate
              ? "İlk içeriğinizi oluşturarak yayın akışını başlatın."
              : "Filtreleri değiştirmeyi deneyin."
          }
          action={
            canCreate ? (
              <Button render={<Link href={routes.admin.blogCreate} />}>Yeni Yazı</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <DataTable columns={columns} data={result.items} getRowKey={(row) => row.id} />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(page));
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
        </>
      )}

      {isPending ? <LoadingState label="İşlem yapılıyor…" /> : null}
    </div>
  );
}
