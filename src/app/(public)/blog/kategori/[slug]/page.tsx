import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { blogService } from "@/features/blog/services";

interface BlogCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { slug } = await params;
  const category = await blogService.getCategoryBySlug(slug);

  if (!category) {
    redirect(routes.public.blog);
  }

  redirect(`${routes.public.blog}?category=${slug}`);
}
