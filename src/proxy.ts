import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isAdminEmail } from "@/lib/admin";

export default async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const protectedPaths = ["/dashboard", "/library", "/history", "/settings", "/case", "/admin"];
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuth && token?.banned && isProtected) {
    return NextResponse.redirect(new URL("/banned", request.url));
  }

  if (isAdminPath && !isAdminEmail(token?.email)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/library/:path*", "/history/:path*", "/settings/:path*", "/case/:path*", "/admin/:path*", "/auth"],
};