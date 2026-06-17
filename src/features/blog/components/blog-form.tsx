"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { BlogPostStatus } from "@prisma/client";

import {
  AdminForm,
  FormCheckboxField,
  FormField,
  FormLayout,
  FormRichTextField,
  FormSection,
  FormSelectField,
  FormTextareaField,
} from "@/components/admin/forms";
import { Button } from "@/components/shared";
import { BLOG_POST_STATUS_LABELS } from "../constants";
import { createBlogPostAction, updateBlogPostAction } from "../actions";
import { blogPostFormSchema, blogSlugFromTitle, type BlogPostFormInput } from "../schemas";
import type { BlogLookupData, BlogPostDetail } from "../types";
import { buildBlogFormDefaults } from "../utils/blog-form-defaults";

interface BlogFormProps {
  mode: "create" | "edit";
  lookup: BlogLookupData;
  post?: BlogPostDetail;
  currentUserId: string;
}

const statusOptions = Object.entries(BLOG_POST_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function BlogForm({ mode, lookup, post, currentUserId }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<BlogPostFormInput>({
    resolver: zodResolver(blogPostFormSchema) as Resolver<BlogPostFormInput>,
    defaultValues: buildBlogFormDefaults(lookup, post, currentUserId),
  });

  const title = form.watch("title");

  useEffect(() => {
    if (!slugEdited && title) {
      form.setValue("slug", blogSlugFromTitle(title), { shouldDirty: true });
    }
  }, [form, slugEdited, title]);

  const onSubmit = (values: BlogPostFormInput) => {
    setFormError(null);
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createBlogPostAction(values)
          : await updateBlogPostAction(post!.id, values);

      if (result && !result.success) {
        setFormError(result.error ?? "Blog yazısı kaydedilemedi.");
      }
    });
  };

  return (
    <AdminForm form={form} onSubmit={onSubmit}>
      <FormLayout
        sidebar={
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Yayın Özeti</h3>
              <p className="text-xs text-muted-foreground">
                İçerik, SEO ve yayın durumunu kaydetmeden önce kontrol edin.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Kaydediliyor…" : mode === "create" ? "Yazıyı Oluştur" : "Değişiklikleri Kaydet"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
              Vazgeç
            </Button>
            {formError ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
            ) : null}
          </div>
        }
      >
        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="Temel Bilgiler" description="Başlık, slug ve özet alanları.">
            <FormField name="title" label="Başlık" />
            <FormField name="slug" label="Slug" onChange={() => setSlugEdited(true)} />
            <FormTextareaField name="excerpt" label="Özet" rows={3} maxLength={500} />
            <FormField name="coverImage" label="Kapak Görseli URL" placeholder="https://..." />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="İçerik" description="Zengin metin editörü ile profesyonel içerik oluşturun.">
            <FormRichTextField name="content" label="İçerik" />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="Sınıflandırma" description="Kategori, etiket ve yazar bilgileri.">
            <FormSelectField
              name="categoryId"
              label="Kategori"
              placeholder="Kategori seçin"
              options={[
                { value: "", label: "Kategori yok" },
                ...lookup.categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />
            <FormSelectField
              name="authorId"
              label="Yazar"
              options={lookup.authors.map((author) => ({
                value: author.id,
                label: author.name ?? author.email,
              }))}
            />
            <div className="space-y-2 sm:col-span-2">
              <p className="text-sm font-medium">Etiketler</p>
              <div className="flex flex-wrap gap-2">
                {lookup.tags.map((tag) => {
                  const tagIds = form.watch("tagIds") ?? [];
                  const checked = tagIds.includes(tag.id);
                  return (
                    <label
                      key={tag.id}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const current = form.getValues("tagIds") ?? [];
                          form.setValue(
                            "tagIds",
                            event.target.checked
                              ? [...current, tag.id]
                              : current.filter((id) => id !== tag.id),
                            { shouldDirty: true },
                          );
                        }}
                      />
                      {tag.name}
                    </label>
                  );
                })}
              </div>
            </div>
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="Yayın" description="Durum, öne çıkarma ve yayın tarihi.">
            <FormSelectField name="status" label="Durum" options={statusOptions} />
            <FormCheckboxField name="isFeatured" label="Öne çıkan yazı" />
            <FormField
              name="publishedAt"
              label="Yayın Tarihi"
              type="datetime-local"
              disabled={form.watch("status") !== BlogPostStatus.PUBLISHED}
            />
          </FormSection>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="SEO" description="Arama motorları ve sosyal medya için metadata.">
            <FormField name="metaTitle" label="Meta Title" maxLength={160} />
            <FormTextareaField name="metaDescription" label="Meta Description" rows={3} maxLength={320} />
            <FormField name="metaKeywords" label="Anahtar Kelimeler" placeholder="emlak, yatırım, konut" />
            <FormField name="canonicalUrl" label="Canonical URL" placeholder="https://..." />
            <FormField name="ogImage" label="Open Graph Görseli" placeholder="https://..." />
          </FormSection>
        </div>
      </FormLayout>
    </AdminForm>
  );
}
