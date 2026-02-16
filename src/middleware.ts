import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLanguage, languages } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Pomiń middleware dla statycznych plików i API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLang = languages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  // Jeśli ścieżka już ma język, pozwól przejść dalej
  if (pathnameHasLang) {
    return NextResponse.next();
  }

  // Jeśli to root, pozwól przejść (domyślnie polski)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Dla innych ścieżek bez języka, dodaj domyślny język (pl) w kontekście
  // ale nie przekierowuj - pozwól Next.js obsłużyć routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|studio).*)",
  ],
};
