import Image from "next/image";
import Link from "next/link";

import { routes } from "@/config/routes";
import type { PublicBlogListItem } from "../types";
import { formatBlogDate, getAuthorDisplayName } from "../utils/blog-formatters";

interface BlogPostCardProps {
  post: PublicBlogListItem;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const authorName = getAuthorDisplayName(post.author.name, post.author.email);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={routes.public.blogPost(post.slug)} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Kapak görseli yok
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {post.category ? (
            <Link
              href={routes.public.blogCategory(post.category.slug)}
              className="rounded-full bg-muted px-2 py-0.5 font-medium hover:text-foreground"
            >
              {post.category.name}
            </Link>
          ) : null}
          <time dateTime={post.publishedAt?.toISOString()}>{formatBlogDate(post.publishedAt)}</time>
        </div>
        <h2 className="text-lg font-semibold leading-snug text-foreground">
          <Link href={routes.public.blogPost(post.slug)} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm">
          <span className="text-muted-foreground">{authorName}</span>
          <span className="text-muted-foreground">{post.viewCount.toLocaleString("tr-TR")} görüntülenme</span>
        </div>
      </div>
    </article>
  );
}
