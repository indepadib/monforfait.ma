import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect /admin routes
  if (path.startsWith('/admin')) {
    const adminLoggedIn = request.cookies.get('admin_logged_in');
    
    if (!adminLoggedIn || adminLoggedIn.value !== 'true') {
      return NextResponse.redirect(new URL('/login?tab=admin', request.url));
    }
  }

  // Optionally protect /operateurs/dashboard
  if (path.startsWith('/operateurs/dashboard')) {
    const operatorEmail = request.cookies.get('operator_email');
    
    // Allow access if admin is logged in (admins can see operator dashboards if needed)
    const adminLoggedIn = request.cookies.get('admin_logged_in');
    
    if ((!operatorEmail || !operatorEmail.value) && (!adminLoggedIn || adminLoggedIn.value !== 'true')) {
      return NextResponse.redirect(new URL('/login?tab=operator', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/operateurs/dashboard/:path*'
  ],
};
