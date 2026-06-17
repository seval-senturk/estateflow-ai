"use client";

import { Link2, MessageCircle, Share2 } from "lucide-react";

import { Button } from "@/components/shared";
import { seoConfig } from "@/config/seo";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  url: string;
  title: string;
  className?: string;
}

function buildShareUrl(platform: "linkedin" | "x" | "facebook" | "whatsapp", url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  }
}

export function SocialShare({ url, title, className }: SocialShareProps) {
  const absoluteUrl = url.startsWith("http") ? url : `${seoConfig.siteUrl}${url}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
    } catch {
      // Clipboard API may be unavailable
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Paylaşım seçenekleri">
      <span className="text-sm font-medium text-muted-foreground">Paylaş:</span>
      <Button
        variant="outline"
        size="icon-sm"
        render={<a href={buildShareUrl("linkedin", absoluteUrl, title)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn'de paylaş" />}
      >
        <Share2 className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        render={<a href={buildShareUrl("x", absoluteUrl, title)} target="_blank" rel="noopener noreferrer" aria-label="X'te paylaş" />}
      >
        <span className="text-xs font-bold">X</span>
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        render={<a href={buildShareUrl("facebook", absoluteUrl, title)} target="_blank" rel="noopener noreferrer" aria-label="Facebook'ta paylaş" />}
      >
        <span className="text-xs font-bold">f</span>
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        render={<a href={buildShareUrl("whatsapp", absoluteUrl, title)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp'ta paylaş" />}
      >
        <MessageCircle className="size-4" />
      </Button>
      <Button variant="outline" size="icon-sm" onClick={copyLink} aria-label="Bağlantıyı kopyala">
        <Link2 className="size-4" />
      </Button>
    </div>
  );
}
