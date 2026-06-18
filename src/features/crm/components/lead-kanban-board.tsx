"use client";

import Link from "next/link";
import { routes } from "@/config/routes";
import type { KanbanColumn } from "../lib/kanban";
import { getLeadFullName } from "../utils/lead-formatters";

interface LeadKanbanBoardProps {
  columns: KanbanColumn[];
}

export function LeadKanbanBoard({ columns }: LeadKanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.slug} className="min-w-72 flex-shrink-0 rounded-xl border border-border bg-muted/30 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">{column.title}</h3>
            <span className="text-xs text-muted-foreground">{column.items.length}</span>
          </div>
          <ul className="space-y-2">
            {column.items.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={routes.admin.leadDetail(lead.id)}
                  className="block rounded-lg border border-border bg-card p-3 text-sm transition hover:border-primary/40"
                >
                  <p className="font-medium">{getLeadFullName(lead.firstName, lead.lastName)}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
