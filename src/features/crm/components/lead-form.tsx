"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";

import {
  AdminForm,
  FormField,
  FormLayout,
  FormSection,
  FormSelectField,
  FormTextareaField,
} from "@/components/admin/forms";
import { Button } from "@/components/shared";
import { LEAD_SOURCE_LABELS } from "../constants";
import { createLeadAction, updateLeadAction } from "../actions";
import { leadFormSchema, type LeadFormInput } from "../schemas";
import type { CrmLookupData, LeadDetail } from "../types";
import { buildLeadFormDefaults } from "../utils/lead-form-defaults";

interface LeadFormProps {
  mode: "create" | "edit";
  lookup: CrmLookupData;
  lead?: LeadDetail;
}

const sourceOptions = Object.entries(LEAD_SOURCE_LABELS).map(([value, label]) => ({ value, label }));

export function LeadForm({ mode, lookup, lead }: LeadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema) as Resolver<LeadFormInput>,
    defaultValues: buildLeadFormDefaults(lookup, lead),
  });

  const onSubmit = (values: LeadFormInput) => {
    setFormError(null);
    startTransition(async () => {
      const result =
        mode === "create" ? await createLeadAction(values) : await updateLeadAction(lead!.id, values);
      if (result && !result.success) setFormError(result.error ?? "Lead kaydedilemedi.");
    });
  };

  return (
    <AdminForm form={form} onSubmit={onSubmit}>
      <FormLayout
        sidebar={
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Kaydediliyor…" : mode === "create" ? "Lead Oluştur" : "Güncelle"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
              Vazgeç
            </Button>
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </div>
        }
      >
        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="İletişim Bilgileri">
            <FormField name="firstName" label="Ad" />
            <FormField name="lastName" label="Soyad" />
            <FormField name="email" label="E-posta" type="email" />
            <FormField name="phone" label="Telefon" />
          </FormSection>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <FormSection title="CRM Bilgileri">
            <FormSelectField name="source" label="Kaynak" options={sourceOptions} />
            <FormSelectField
              name="statusId"
              label="Durum"
              options={lookup.statuses.map((status) => ({ value: status.id, label: status.name }))}
            />
            <FormSelectField
              name="assignedToId"
              label="Danışman"
              options={[
                { value: "", label: "Atanmadı" },
                ...lookup.agents.map((agent) => ({ value: agent.id, label: agent.name ?? agent.email })),
              ]}
            />
            <FormSelectField
              name="propertyId"
              label="İlgilendiği İlan"
              options={[
                { value: "", label: "İlan yok" },
                ...lookup.properties.map((property) => ({ value: property.id, label: property.title })),
              ]}
            />
            <FormField name="budget" label="Bütçe" type="number" />
            <FormTextareaField name="notes" label="Notlar" rows={4} />
          </FormSection>
        </div>
      </FormLayout>
    </AdminForm>
  );
}
