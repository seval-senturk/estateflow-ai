"use client";

import { useState, useTransition } from "react";

import { Button, Input } from "@/components/shared";
import { submitContactRequestAction } from "@/features/crm/actions";

interface ContactFormProps {
  propertyTitle?: string;
}

export function ContactForm({ propertyTitle }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await submitContactRequestAction({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? "") || undefined,
        subject: String(formData.get("subject") ?? "") || undefined,
        message: String(formData.get("message") ?? ""),
        propertyTitle,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Mesaj gönderilemedi.");
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h3 className="font-heading text-lg font-semibold">Mesajınız alındı</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8">
      {propertyTitle ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <span className="text-muted-foreground">İlgilendiğiniz ilan: </span>
          <span className="font-medium">{propertyTitle}</span>
        </div>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium">
            Ad Soyad
          </label>
          <Input id="contact-name" name="name" required placeholder="Adınız Soyadınız" />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-phone" className="text-sm font-medium">
            Telefon
          </label>
          <Input id="contact-phone" name="phone" type="tel" placeholder="+90 5XX XXX XX XX" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          E-posta
        </label>
        <Input id="contact-email" name="email" type="email" required placeholder="ornek@email.com" />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-sm font-medium">
          Konu
        </label>
        <Input
          id="contact-subject"
          name="subject"
          placeholder="İlan hakkında bilgi"
          defaultValue={propertyTitle ? `${propertyTitle} hakkında` : undefined}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Mesajınız
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Size nasıl yardımcı olabiliriz?"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Gönderiliyor…" : "Mesaj Gönder"}
      </Button>
    </form>
  );
}
