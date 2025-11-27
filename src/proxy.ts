import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Proxy para proteção de rotas com Auth.js
 * Next.js 16: usa named export 'proxy' ou default export
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isPublicRoute = pathname === "/" || pathname === "/help" || pathname.startsWith("/f/");
  const isAuthRoute = pathname === "/login";
  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

/**
 * Matcher: define onde o proxy deve rodar
 * Exclui: API routes, arquivos estáticos, imagens, _next/data
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - _next/data (data fetching)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     */
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
