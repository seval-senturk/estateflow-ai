import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { routes } from "@/config/routes";
import {
  AUTH_ERROR_CODES,
  resolveAdminRoutePermission,
} from "@/features/auth/constants";
import { canAccessAdminPanel, hasPermission } from "@/lib/authorization";
import type { Permission } from "@/config/permissions";

const publicPaths = [
  routes.public.home,
  routes.public.properties,
  routes.public.blog,
  routes.public.contact,
  routes.public.about,
  routes.auth.login,
  routes.api.health,
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function buildLoginRedirect(request: {
  nextUrl: URL;
  url: string;
}, callbackPath: string, errorCode?: string) {
  const loginUrl = new URL(routes.auth.login, request.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", callbackPath);
  if (errorCode) {
    loginUrl.searchParams.set("error", errorCode);
  }
  return NextResponse.redirect(loginUrl);
}

function buildForbiddenRedirect(request: { nextUrl: URL }) {
  const redirectUrl = new URL(routes.admin.dashboard, request.nextUrl.origin);
  redirectUrl.searchParams.set("error", AUTH_ERROR_CODES.FORBIDDEN);
  return NextResponse.redirect(redirectUrl);
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const isLoggedIn = Boolean(session?.user);
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAdminRoute) {
    if (!isLoggedIn || !session?.user) {
      return buildLoginRedirect(request, pathname);
    }

    const user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image ?? null,
      role: session.user.role,
      permissions: session.user.permissions ?? [],
    };

    if (!canAccessAdminPanel(user)) {
      return buildLoginRedirect(
        request,
        pathname,
        AUTH_ERROR_CODES.FORBIDDEN,
      );
    }

    const requiredPermission = resolveAdminRoutePermission(pathname);

    if (
      requiredPermission &&
      !hasPermission(user.permissions, requiredPermission as Permission)
    ) {
      return buildForbiddenRedirect(request);
    }

    return NextResponse.next();
  }

  if (isAuthRoute && isLoggedIn && session?.user) {
    const user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image ?? null,
      role: session.user.role,
      permissions: session.user.permissions ?? [],
    };

    if (canAccessAdminPanel(user)) {
      return NextResponse.redirect(
        new URL(routes.admin.dashboard, request.nextUrl.origin),
      );
    }
  }

  if (!isPublicPath(pathname) && !isAdminRoute && !isAuthRoute && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
