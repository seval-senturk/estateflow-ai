"use client";

import { useState } from "react";

import { Button, Input } from "@/components/shared";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setSubmitted(true);
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
        <Input id="contact-subject" name="subject" placeholder="İlan hakkında bilgi" />
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
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Gönderiliyor…" : "Mesaj Gönder"}
      </Button>
    </form>
  );
}
