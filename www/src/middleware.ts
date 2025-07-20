import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COOKIE_KEYS, ROUTES } from "./lib/constants";

export async function middleware(request: NextRequest) {
  if (request.url !== process.env.NEXT_PUBLIC_SITE_URL) {
    const fromPath = new URL(request.url).pathname;
    const authCookie = (await cookies()).get(COOKIE_KEYS.token)?.value;
    if (!authCookie) {
      return NextResponse.redirect(
        new URL(ROUTES.auth.signIn + `?redirect=` + fromPath, request.url),
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|auth/sign-in|embed|auth/sign-up|_next/image|favicon.ico).*)",
  ],
};
