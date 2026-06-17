import type { Role } from "@/config/roles";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: Role;
}

export interface SessionData {
  user: AuthUser;
  expires: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
