import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas protegidas (requerem autenticação)
const protectedRoutes = ["/dashboard"];

// Rotas de autenticação (usuários logados são redirecionados)
const authRoutes = ["/login"];

// Rotas públicas (não requerem autenticação)
const publicRoutes = ["/", "/help", "/publicform", "/f"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await auth();

  // Rotas públicas sempre permitidas (mesmo para usuários autenticados)
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Redireciona usuários não autenticados de rotas protegidas para /login
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redireciona usuários autenticados de rotas de auth para /dashboard
  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Rotas onde o proxy NÃO deve rodar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
