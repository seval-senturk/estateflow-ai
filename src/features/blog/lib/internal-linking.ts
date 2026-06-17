import { routes } from "@/config/routes";

export function buildPropertyInternalLink(slug: string, label?: string) {
  const href = routes.public.propertyDetail(slug);
  const text = label ?? slug;
  return `<a href="${href}" data-internal-link="property">${text}</a>`;
}

export function buildBlogInternalLink(slug: string, label?: string) {
  const href = routes.public.blogPost(slug);
  const text = label ?? slug;
  return `<a href="${href}" data-internal-link="blog">${text}</a>`;
}

export function extractInternalLinks(html: string): Array<{ type: "property" | "blog"; slug: string; href: string }> {
  const links: Array<{ type: "property" | "blog"; slug: string; href: string }> = [];
  const propertyPattern = /href="(\/properties\/([^"]+))"/g;
  const blogPattern = /href="(\/blog\/([^"]+))"/g;

  let match: RegExpExecArray | null;
  while ((match = propertyPattern.exec(html)) !== null) {
    if (match[1] && match[2]) {
      links.push({ type: "property", slug: match[2], href: match[1] });
    }
  }
  while ((match = blogPattern.exec(html)) !== null) {
    if (match[1] && match[2]) {
      links.push({ type: "blog", slug: match[2], href: match[1] });
    }
  }

  return links;
}
