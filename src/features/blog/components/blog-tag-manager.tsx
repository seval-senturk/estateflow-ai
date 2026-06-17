"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AdminForm, FormField, FormSection } from "@/components/admin/forms";
import { Button, DataTable, type DataTableColumn } from "@/components/shared";
import { createBlogTagAction, deleteBlogTagAction } from "../actions";
import { blogSlugFromTitle, blogTagFormSchema, type BlogTagFormInput } from "../schemas";
import type { BlogTagListItem } from "../types";

interface BlogTagManagerProps {
  tags: BlogTagListItem[];
}

export function BlogTagManager({ tags }: BlogTagManagerProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BlogTagFormInput>({
    resolver: zodResolver(blogTagFormSchema),
    defaultValues: { name: "", slug: "" },
  });

  const name = form.watch("name");

  useEffect(() => {
    if (name && !form.formState.dirtyFields.slug) {
      form.setValue("slug", blogSlugFromTitle(name));
    }
  }, [form, name]);

  const columns: DataTableColumn<BlogTagListItem>[] = [
    { key: "name", header: "Ad", cell: (row) => row.name },
    { key: "slug", header: "Slug", cell: (row) => row.slug },
    { key: "posts", header: "Yazı", cell: (row) => row.postCount },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!window.confirm(`"${row.name}" etiketini silmek istiyor musunuz?`)) return;
            startTransition(async () => {
              await deleteBlogTagAction(row.id);
            });
          }}
        >
          Sil
        </Button>
      ),
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <DataTable columns={columns} data={tags} getRowKey={(row) => row.id} />
      <AdminForm
        form={form}
        onSubmit={(values) => {
          startTransition(async () => {
            const result = await createBlogTagAction(values);
            if (result?.success) {
              form.reset({ name: "", slug: "" });
            }
          });
        }}
      >
        <FormSection title="Yeni Etiket">
          <FormField name="name" label="Ad" />
          <FormField name="slug" label="Slug" />
          <Button type="submit" disabled={isPending}>
            Etiket Ekle
          </Button>
        </FormSection>
      </AdminForm>
    </div>
  );
}
