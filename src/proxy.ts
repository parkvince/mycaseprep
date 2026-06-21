import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const protectedPaths = ["/dashboard", "/library", "/history", "/settings", "/case"];
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/library/:path*", "/history/:path*", "/settings/:path*", "/case/:path*", "/auth"],
};