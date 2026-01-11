// proxy.ts (formerly middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Rename function to 'proxy'
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// 2. Configuration remains the same
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
