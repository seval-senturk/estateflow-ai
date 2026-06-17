import type { Role } from "@/config/roles";
import type { Permission } from "@/config/permissions";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role: Role;
      permissions: Permission[];
    };
  }

  interface User {
    role: Role;
    permissions: Permission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    permissions: Permission[];
  }
}
