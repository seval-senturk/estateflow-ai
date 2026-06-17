"use client";

import { useRouter } from "next/navigation";

import { Pagination } from "@/components/shared";
import { routes } from "@/config/routes";

interface PublicPropertyPaginationProps {
  page: number;
  totalPages: number;
}

export function PublicPropertyPagination({
  page,
  totalPages,
}: PublicPropertyPaginationProps) {
  const router = useRouter();

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={(nextPage) =>
        router.push(`${routes.public.properties}?page=${nextPage}`)
      }
    />
  );
}
