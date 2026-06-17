import { BLOG_POST_STATUS_LABELS } from "../constants";
import type { BlogPostStatus } from "@prisma/client";

export function formatBlogDate(date: Date | string | null): string {
  if (!date) return "—";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatBlogDateTime(date: Date | string | null): string {
  if (!date) return "—";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function getBlogStatusLabel(status: BlogPostStatus): string {
  return BLOG_POST_STATUS_LABELS[status];
}

export function getAuthorDisplayName(name: string | null, email: string): string {
  return name?.trim() || email;
}

export function extractTableOfContents(html: string): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const pattern = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(html)) !== null) {
    const level = Number(match[1]);
    const raw = match[2];
    if (!raw) continue;
    const text = raw.replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    index += 1;
    headings.push({ id: `heading-${index}`, text, level });
  }

  return headings;
}

export function addHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h([1-3])([^>]*)>(.*?)<\/h\1>/gi, (_full, level, attrs, content) => {
    index += 1;
    const id = `heading-${index}`;
    if (String(attrs).includes("id=")) {
      return `<h${level}${attrs}>${content}</h${level}>`;
    }
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
  });
}
