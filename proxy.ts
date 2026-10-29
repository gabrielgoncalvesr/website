import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";
import { isDesign } from "@/lib/designs";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Design lab: /en?design=3 pins a design via cookie.
  const design = searchParams.get("design") ?? undefined;
  if (isDesign(design)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("design");
    const res = NextResponse.redirect(url);
    res.cookies.set("design", design, { path: "/", maxAge: 31536000, sameSite: "lax" });
    return res;
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|feed.xml|sitemap.xml|robots.txt|favicon|icon|apple-icon|.*\\..*).*)"],
};
