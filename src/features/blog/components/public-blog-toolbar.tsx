"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Pagination, Search } from "@/components/shared";
import { routes } from "@/config/routes";

interface PublicBlogToolbarProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  page: number;
  totalPages: number;
  activeCategorySlug?: string;
  activeTagSlug?: string;
}

export function PublicBlogToolbar({
  categories,
  page,
  totalPages,
  activeCategorySlug,
  activeTagSlug,
}: PublicBlogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushWithParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="mb-8 space-y-4">
      <div className="max-w-md">
        <Search
          defaultValue={searchParams.get("q") ?? ""}
          onSearch={(value) => pushWithParams({ q: value || undefined, page: undefined })}
          placeholder="Blogda ara…"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={routes.public.blog}
          className={`rounded-full border px-3 py-1 text-sm ${
            !activeCategorySlug && !activeTagSlug
              ? "border-primary bg-primary/10 text-primary"
              : "border-border"
          }`}
        >
          Tümü
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={routes.public.blogCategory(category.slug)}
            className={`rounded-full border px-3 py-1 text-sm ${
              activeCategorySlug === category.slug
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => pushWithParams({ page: String(nextPage) })}
      />
    </div>
  );
}
