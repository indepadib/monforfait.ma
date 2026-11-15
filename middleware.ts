import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Authorization never relies on browser-set cookies.
// Supabase Auth identities and the server-side allowlists in leads-gateway
// enforce access to personal and commercial records.
export function middleware(request:NextRequest){
  if(request.nextUrl.pathname.startsWith('/operateurs/dashboard')){
    return NextResponse.redirect(new URL('/partenaires',request.url))
  }
  return NextResponse.next()
}
export const config={matcher:['/operateurs/dashboard/:path*']}
