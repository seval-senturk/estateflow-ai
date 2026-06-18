"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/shared";
import { submitPropertyInquiryAction } from "../actions";

interface PropertyInquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function PropertyInquiryForm({ propertyId, propertyTitle }: PropertyInquiryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitPropertyInquiryAction({
        ...form,
        propertyId,
      });
      if (result.success) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(result.error ?? "Talep gönderilemedi.");
      }
    });
  };

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="font-medium text-primary">Talebiniz alındı</p>
        <p className="mt-1 text-muted-foreground">
          {propertyTitle} ilanı için danışmanımız en kısa sürede sizinle iletişime geçecek.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium">Bu ilan hakkında bilgi alın</p>
      <input
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="Ad Soyad"
        required
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
      />
      <input
        type="email"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="E-posta"
        required
        value={form.email}
        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
      />
      <input
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="Telefon"
        value={form.phone}
        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
      />
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        rows={3}
        placeholder="Mesajınız"
        value={form.message}
        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Gönderiliyor…" : "Bilgi Talep Et"}
      </Button>
    </form>
  );
}
