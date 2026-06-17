import type { DashboardWidgetDefinition } from "../types";

export const DASHBOARD_WIDGETS: DashboardWidgetDefinition[] = [
  {
    id: "stats",
    title: "Operational Metrics",
    description: "High-level counts across core modules",
    span: "full",
  },
  {
    id: "latest-properties",
    title: "Latest Properties",
    description: "Recently created listings",
    span: "half",
  },
  {
    id: "lead-summary",
    title: "Lead Summary",
    description: "Pipeline snapshot",
    span: "half",
  },
  {
    id: "recent-activity",
    title: "Recent Activity",
    description: "Latest workspace events",
    span: "half",
  },
  {
    id: "system-status",
    title: "System Status",
    description: "Platform health indicators",
    span: "half",
  },
];
