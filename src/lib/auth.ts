import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { headers } from "next/headers";

import { isProduction } from "@/config/environment";
import type { Permission } from "@/config/permissions";
import type { Role } from "@/config/roles";
import { authService } from "@/features/auth/services";
import { loginSchema } from "@/features/auth/schemas";
import { SESSION_MAX_AGE_SECONDS } from "@/features/auth/constants";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  cookies: {
    sessionToken: {
      name: isProduction
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const requestHeaders = await headers();
        const ipAddress =
          requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          requestHeaders.get("x-real-ip") ??
          undefined;
        const userAgent = requestHeaders.get("user-agent") ?? undefined;

        const user = await authService.authenticate(parsed.data.email, parsed.data.password, {
          ipAddress,
          userAgent,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          permissions: user.permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;
        token.permissions = (user as { permissions: Permission[] }).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.permissions = (token.permissions as Permission[]) ?? [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
