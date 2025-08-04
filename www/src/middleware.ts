import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COOKIE_KEYS, ROUTES } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const fromPath = url.pathname;
  const isHomePagePath = fromPath === "/";

  if (process.env.NODE_ENV === "development") {
    if (!isHomePagePath) {
      const authCookie = (await cookies()).get(COOKIE_KEYS.token)?.value;
      const businesses = (await cookies()).get(COOKIE_KEYS.business);
      if (!authCookie) {
        const redirectTo = new URL(ROUTES.auth.signIn, request.url);
        redirectTo.searchParams.set("redirect", fromPath);
        return NextResponse.redirect(redirectTo);
      }
      if (!businesses) {
        const redirectTo = new URL(ROUTES.onboard.business, request.url);
        redirectTo.searchParams.set("redirect", fromPath);
        return NextResponse.redirect(redirectTo);
      }
    }
    return NextResponse.next();
  } else {
    if (!isHomePagePath) {
      const redirectTo = new URL("https://tally.so/r/w26ADj", request.url);
      return NextResponse.redirect(redirectTo);
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|demo.html|onboard/*|auth/*|embed|_next/image|favicon.ico).*)",
  ],
};
