import type { AiFeature } from "@prisma/client";

export const AI_FEATURES = {
  PROPERTY_DESCRIPTION: "PROPERTY_DESCRIPTION",
  PROPERTY_SUMMARY: "PROPERTY_SUMMARY",
  BLOG_ASSISTANT: "BLOG_ASSISTANT",
  SEO_ASSISTANT: "SEO_ASSISTANT",
  SMART_SEARCH: "SMART_SEARCH",
  LEAD_SUMMARY: "LEAD_SUMMARY",
  CONTENT_IMPROVEMENT: "CONTENT_IMPROVEMENT",
} as const satisfies Record<string, AiFeature>;

export const AI_FEATURE_LABELS: Record<AiFeature, string> = {
  PROPERTY_DESCRIPTION: "İlan Açıklaması",
  PROPERTY_SUMMARY: "İlan Özeti",
  BLOG_ASSISTANT: "Blog Asistanı",
  SEO_ASSISTANT: "SEO Asistanı",
  SMART_SEARCH: "Akıllı Arama",
  LEAD_SUMMARY: "Lead Özeti",
  CONTENT_IMPROVEMENT: "İçerik İyileştirme",
};

export const AI_REQUEST_TYPES = {
  GENERATE_DESCRIPTION: "generate_description",
  GENERATE_SUMMARY: "generate_summary",
  BLOG_TITLES: "blog_titles",
  BLOG_META: "blog_meta",
  BLOG_DRAFT: "blog_draft",
  BLOG_CATEGORY: "blog_category",
  SEO_GENERATE: "seo_generate",
  SMART_SEARCH_PARSE: "smart_search_parse",
  LEAD_SUMMARY: "lead_summary",
  CONTENT_IMPROVEMENT: "content_improvement",
} as const;
