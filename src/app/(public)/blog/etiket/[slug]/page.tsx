import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { blogService } from "@/features/blog/services";

interface BlogTagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { slug } = await params;
  const tag = await blogService.getTagBySlug(slug);

  if (!tag) {
    redirect(routes.public.blog);
  }

  redirect(`${routes.public.blog}?tag=${slug}`);
}
