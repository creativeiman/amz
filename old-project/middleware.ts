import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // In a real application, you would check for proper authentication
    // For now, we'll let the client-side handle the authentication check
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
  ],
}



