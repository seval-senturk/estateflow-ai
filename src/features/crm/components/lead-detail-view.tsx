"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, UserMinus, UserPlus } from "lucide-react";

import { Button, Select } from "@/components/shared";
import { routes } from "@/config/routes";
import { AiLeadSummaryCard } from "@/features/ai/components";
import {
  addLeadNoteAction,
  assignLeadAgentAction,
  updateLeadStatusAction,
} from "../actions";
import type { CrmLookupData, LeadDetail } from "../types";
import { formatLeadDate, getLeadFullName, getLeadSourceLabel } from "../utils/lead-formatters";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadTimeline } from "./lead-timeline";

interface LeadDetailViewProps {
  lead: LeadDetail;
  lookup: CrmLookupData;
  canUpdate: boolean;
  canAssign: boolean;
}

export function LeadDetailView({ lead, lookup, canUpdate, canAssign }: LeadDetailViewProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (statusId: string | null) => {
    if (!statusId) return;
    startTransition(async () => {
      const result = await updateLeadStatusAction(lead.id, statusId);
      if (result && !result.success) setError(result.error ?? "Durum güncellenemedi.");
      else router.refresh();
    });
  };

  const handleAssign = (assignedToId: string | null) => {
    if (!assignedToId) return;
    startTransition(async () => {
      const result = await assignLeadAgentAction(lead.id, assignedToId);
      if (result && !result.success) setError(result.error ?? "Atama yapılamadı.");
      else router.refresh();
    });
  };

  const handleUnassign = () => {
    startTransition(async () => {
      const result = await assignLeadAgentAction(lead.id, null);
      if (result && !result.success) setError(result.error ?? "Atama kaldırılamadı.");
      else router.refresh();
    });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    startTransition(async () => {
      const result = await addLeadNoteAction(lead.id, { content: note.trim() });
      if (result && !result.success) setError(result.error ?? "Not eklenemedi.");
      else {
        setNote("");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{getLeadFullName(lead.firstName, lead.lastName)}</h1>
          <p className="text-sm text-muted-foreground">
            {getLeadSourceLabel(lead.source)} · {formatLeadDate(lead.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {canUpdate ? (
            <Button variant="outline" render={<Link href={routes.admin.leadEdit(lead.id)} />}>
              <Pencil className="mr-2 size-4" />
              Düzenle
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">İletişim Bilgileri</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">E-posta</dt>
                <dd>{lead.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Telefon</dt>
                <dd>{lead.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Bütçe</dt>
                <dd>{lead.budget ? `${lead.budget} ${lead.currency ?? "TRY"}` : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">İlgilendiği İlan</dt>
                <dd>{lead.property?.title ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">Zaman Çizelgesi</h2>
            <LeadTimeline notes={lead.leadNotes} activities={lead.activities} />
          </section>
        </div>

        <div className="space-y-6">
          <AiLeadSummaryCard leadId={lead.id} />

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">Durum</h2>
            <LeadStatusBadge status={lead.status} className="mb-4" />
            {canUpdate ? (
              <Select
                value={lead.status.id}
                onValueChange={handleStatusChange}
                disabled={isPending}
                options={lookup.statuses.map((status) => ({ value: status.id, label: status.name }))}
              />
            ) : null}
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">Atanan Danışman</h2>
            <p className="mb-4 text-sm">{lead.assignedTo?.name ?? lead.assignedTo?.email ?? "Atanmadı"}</p>
            {canAssign ? (
              <div className="space-y-2">
                <Select
                  placeholder="Danışman seç"
                  onValueChange={handleAssign}
                  disabled={isPending}
                  options={lookup.agents.map((agent) => ({
                    value: agent.id,
                    label: agent.name ?? agent.email,
                  }))}
                />
                {lead.assignedTo ? (
                  <Button variant="outline" size="sm" onClick={handleUnassign} disabled={isPending}>
                    <UserMinus className="mr-2 size-4" />
                    Atamayı Kaldır
                  </Button>
                ) : (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <UserPlus className="size-3" />
                    Yukarıdan danışman atayın
                  </p>
                )}
              </div>
            ) : null}
          </section>

          {canUpdate ? (
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-medium">Not Ekle</h2>
              <textarea
                className="mb-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Müşteri arandı, tekrar dönüş bekleniyor…"
              />
              <Button onClick={handleAddNote} disabled={isPending || !note.trim()}>
                Not Kaydet
              </Button>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
