/**
 * Blog analytics integration points (foundation only).
 * Wire to analytics provider in a future phase.
 */

export interface BlogViewEvent {
  postId: string;
  slug: string;
  categorySlug?: string | null;
  referrer?: string;
}

export interface BlogContentMetrics {
  mostViewedPosts: Array<{ postId: string; title: string; viewCount: number }>;
  popularCategories: Array<{ categoryId: string; name: string; viewCount: number }>;
  popularTags: Array<{ tagId: string; name: string; viewCount: number }>;
}

export function trackBlogView(event: BlogViewEvent): void {
  void event;
  // Integration point for GA4, Plausible, etc.
}

export async function getBlogContentMetrics(): Promise<BlogContentMetrics> {
  return {
    mostViewedPosts: [],
    popularCategories: [],
    popularTags: [],
  };
}
