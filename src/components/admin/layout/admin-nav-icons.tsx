import type { ComponentType } from "react";
import {
  Activity,
  Building2,
  FileText,
  Images,
  LayoutDashboard,
  Settings,
  UserCog,
  UsersRound,
} from "lucide-react";

import type { AdminNavIcon } from "@/config/navigation";

export const adminNavIcons: Record<
  AdminNavIcon,
  ComponentType<{ className?: string }>
> = {
  "layout-dashboard": LayoutDashboard,
  "building-2": Building2,
  images: Images,
  "users-round": UsersRound,
  "file-text": FileText,
  "user-cog": UserCog,
  settings: Settings,
  activity: Activity,
};
