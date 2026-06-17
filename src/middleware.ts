import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { routes } from "@/config/routes";

const publicPaths = [
  routes.public.home,
  routes.public.properties,
  routes.public.blog,
  routes.public.contact,
  routes.public.about,
  routes.auth.login,
  routes.auth.register,
  routes.auth.forgotPassword,
  routes.api.health,
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL(routes.auth.login, req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(routes.admin.dashboard, req.nextUrl.origin));
  }

  if (!isPublicPath(pathname) && !isAdminRoute && !isAuthRoute && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
