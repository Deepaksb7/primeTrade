import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  if (token &&
    (
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup") ||
      url.pathname === "/"
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/profile"))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    '/',
    "/profile/:path*",
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
}