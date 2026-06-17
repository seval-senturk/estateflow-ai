import type { Role } from "@/config/roles";
import type { Permission } from "@/config/permissions";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: Role;
  permissions: Permission[];
}

export interface LoginActionState {
  success: boolean;
  error?: string;
  code?: string;
}
