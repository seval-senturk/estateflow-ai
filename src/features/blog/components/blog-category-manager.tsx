"use client";

import { useEffect, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AdminForm,
  FormCheckboxField,
  FormField,
  FormSection,
  FormTextareaField,
} from "@/components/admin/forms";
import { Button, DataTable, type DataTableColumn } from "@/components/shared";
import { createBlogCategoryAction, deleteBlogCategoryAction } from "../actions";
import { blogCategoryFormSchema, blogSlugFromTitle, type BlogCategoryFormInput } from "../schemas";
import type { BlogCategoryListItem } from "../types";

interface BlogCategoryManagerProps {
  categories: BlogCategoryListItem[];
}

export function BlogCategoryManager({ categories }: BlogCategoryManagerProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BlogCategoryFormInput>({
    resolver: zodResolver(blogCategoryFormSchema) as Resolver<BlogCategoryFormInput>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sortOrder: categories.length + 1,
      isActive: true,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  });

  const name = form.watch("name");

  useEffect(() => {
    if (name && !form.formState.dirtyFields.slug) {
      form.setValue("slug", blogSlugFromTitle(name));
    }
  }, [form, name]);

  const columns: DataTableColumn<BlogCategoryListItem>[] = [
    { key: "name", header: "Ad", cell: (row) => row.name },
    { key: "slug", header: "Slug", cell: (row) => row.slug },
    { key: "posts", header: "Yazı", cell: (row) => row.postCount },
    {
      key: "status",
      header: "Durum",
      cell: (row) => (row.isActive ? "Aktif" : "Pasif"),
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!window.confirm(`"${row.name}" kategorisini silmek istiyor musunuz?`)) return;
            startTransition(async () => {
              await deleteBlogCategoryAction(row.id);
            });
          }}
        >
          Sil
        </Button>
      ),
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <DataTable columns={columns} data={categories} getRowKey={(row) => row.id} />
      <AdminForm
        form={form}
        onSubmit={(values) => {
          startTransition(async () => {
            const result = await createBlogCategoryAction(values);
            if (result?.success) {
              form.reset({
                name: "",
                slug: "",
                description: "",
                sortOrder: categories.length + 2,
                isActive: true,
                metaTitle: "",
                metaDescription: "",
                metaKeywords: "",
              });
            }
          });
        }}
      >
        <FormSection title="Yeni Kategori">
          <FormField name="name" label="Ad" />
          <FormField name="slug" label="Slug" />
          <FormTextareaField name="description" label="Açıklama" rows={3} />
          <FormField name="sortOrder" label="Sıra" type="number" />
          <FormCheckboxField name="isActive" label="Aktif" />
          <Button type="submit" disabled={isPending}>
            Kategori Ekle
          </Button>
        </FormSection>
      </AdminForm>
    </div>
  );
}
