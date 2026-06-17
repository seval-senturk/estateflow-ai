import { cn } from "@/lib/utils";

interface BlogContentProps {
  html: string;
  className?: string;
}

export function BlogContent({ html, className }: BlogContentProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary prose-img:rounded-lg",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
