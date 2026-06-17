import type { PrismaClient } from "@prisma/client";

import { BLOG_CATEGORIES } from "./data";
import { upsertActiveBySlug } from "./utils";

const BLOG_TAGS = [
  { name: "Yatırım", slug: "yatirim" },
  { name: "Konut", slug: "konut" },
  { name: "Kira", slug: "kira" },
  { name: "İstanbul", slug: "istanbul" },
  { name: "Trend", slug: "trend" },
] as const;

export async function seedBlogData(prisma: PrismaClient) {
  console.log("  → Seeding blog categories...");

  for (const category of BLOG_CATEGORIES) {
    await upsertActiveBySlug(prisma, "blogCategory", category.slug, category);
  }

  console.log(`    ✓ ${BLOG_CATEGORIES.length} blog categories`);

  console.log("  → Seeding blog tags...");

  for (const tag of BLOG_TAGS) {
    await upsertActiveBySlug(prisma, "blogTag", tag.slug, tag);
  }

  console.log(`    ✓ ${BLOG_TAGS.length} blog tags`);
}

export async function seedBlogPosts(prisma: PrismaClient) {
  console.log("  → Seeding blog posts...");

  const author = await prisma.user.findFirst({
    where: { email: "admin@estateflow.ai", deletedAt: null },
  });

  if (!author) {
    console.log("    ⚠ Admin user not found, skipping blog posts");
    return;
  }

  const category = await prisma.blogCategory.findFirst({
    where: { slug: "yatirim-rehberi", deletedAt: null },
  });

  const tags = await prisma.blogTag.findMany({
    where: { slug: { in: ["yatirim", "konut", "istanbul"] }, deletedAt: null },
  });

  const existing = await prisma.blogPost.findFirst({
    where: { slug: "2026-emlak-yatirim-rehberi", deletedAt: null },
  });

  if (existing) {
    console.log("    ✓ Blog posts already seeded");
    return;
  }

  const post = await prisma.blogPost.create({
    data: {
      title: "2026 Emlak Yatırım Rehberi: Fırsatlar ve Stratejiler",
      slug: "2026-emlak-yatirim-rehberi",
      excerpt:
        "2026 yılında gayrimenkul yatırımı yaparken dikkat edilmesi gereken trendler, bölgesel fırsatlar ve uzman önerileri.",
      content: `<h2>Piyasa Görünümü</h2><p>2026 yılında konut ve ticari gayrimenkul piyasasında seçici yatırım stratejileri öne çıkıyor. Lokasyon, kira getirisi ve likidite üçlüsü karar sürecinin merkezinde.</p><h2>Bölgesel Fırsatlar</h2><p>İstanbul'un gelişen ilçeleri ve Anadolu'daki büyüyen şehirler yatırımcılar için cazip alternatifler sunuyor.</p><blockquote><p>Uzun vadeli değer artışı için altyapı yatırımlarını takip edin.</p></blockquote><h2>Sonuç</h2><p>Profesyonel danışmanlık ve detaylı bölge analizi, başarılı emlak yatırımının temelidir.</p>`,
      coverImage:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      categoryId: category?.id,
      authorId: author.id,
      status: "PUBLISHED",
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date(),
      metaTitle: "2026 Emlak Yatırım Rehberi | EstateFlow AI",
      metaDescription:
        "2026 emlak yatırım trendleri, bölgesel fırsatlar ve uzman stratejileri hakkında kapsamlı rehber.",
      metaKeywords: "emlak yatırım, 2026, konut, gayrimenkul",
      createdById: author.id,
      updatedById: author.id,
      tags: {
        create: tags.map((tag) => ({ tagId: tag.id })),
      },
    },
  });

  console.log(`    ✓ 1 blog post (${post.slug})`);
}
