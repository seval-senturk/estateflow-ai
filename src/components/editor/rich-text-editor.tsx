"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo,
  Table2,
  Underline as UnderlineIcon,
  Undo,
  Video,
} from "lucide-react";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "İçeriğinizi yazmaya başlayın…",
  className,
  minHeight = "320px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full h-auto" } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlock.configure({ HTMLAttributes: { class: "rounded-md bg-muted p-4 font-mono text-sm" } }),
      Placeholder.configure({ placeholder }),
      Underline,
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: "rounded-lg w-full aspect-video" } }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none px-4 py-3",
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı URL'si", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Görsel URL'si");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube video URL'si");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className={cn("animate-pulse rounded-lg border border-border bg-muted", className)}
        style={{ minHeight }}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-background", className)}>
      <div
        className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2"
        role="toolbar"
        aria-label="Metin düzenleme araçları"
      >
        <ToolbarButton
          label="Kalın"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="İtalik"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Altı çizili"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <ToolbarButton
          label="Başlık 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Başlık 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Başlık 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <ToolbarButton
          label="Madde işaretli liste"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numaralı liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Alıntı"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Bağlantı" active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Görsel ekle" onClick={addImage}>
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Kod bloğu" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Tablo ekle" onClick={insertTable}>
          <Table2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="YouTube göm" onClick={addYoutube}>
          <Video className="size-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <ToolbarButton label="Geri al" onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Yinele" onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="size-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
