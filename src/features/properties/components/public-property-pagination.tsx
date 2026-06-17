"use client";

import { useRouter } from "next/navigation";

import { Pagination } from "@/components/shared";
import { routes } from "@/config/routes";

interface PublicPropertyPaginationProps {
  page: number;
  totalPages: number;
  searchParams?: Record<string, string | string[] | undefined>;
}

function buildPageUrl(
  page: number,
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue;
      const normalized = Array.isArray(value) ? value[0] : value;
      if (normalized) params.set(key, normalized);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const qs = params.toString();
  return qs ? `${routes.public.properties}?${qs}` : routes.public.properties;
}

export function PublicPropertyPagination({
  page,
  totalPages,
  searchParams,
}: PublicPropertyPaginationProps) {
  const router = useRouter();

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={(nextPage) => router.push(buildPageUrl(nextPage, searchParams))}
    />
  );
}
