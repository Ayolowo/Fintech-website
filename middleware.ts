import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to login and register pages
  if (
    pathname.startsWith('/business/login') ||
    pathname.startsWith('/business/register') ||
    pathname.startsWith('/business/onboarding')
  ) {
    return NextResponse.next();
  }

  // For business dashboard routes, the ProtectedRoute component will handle auth
  // This middleware is just for basic route protection
  return NextResponse.next();
}

export const config = {
  matcher: '/business/:path*',
};
