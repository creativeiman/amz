import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Define route access rules
const publicRoutes = [
  '/',
  '/about',
  '/pricing',
  '/privacy',
  '/terms',
  '/login',
  '/register',
  '/forgot-password',
]

const authRoutes = ['/login', '/register', '/forgot-password']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if it's an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if it's an API route
  const isApiRoute = pathname.startsWith('/api')

  // Allow public API routes
  if (isApiRoute && (pathname.startsWith('/api/auth') || isPublicRoute)) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    // Redirect admins to admin panel, regular users to dashboard
    const redirectUrl = userRole === 'ADMIN' ? '/admin' : '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  // Allow access to public routes
  if (isPublicRoute && !isLoggedIn) {
    return NextResponse.next()
  }

  // Protect user dashboard routes - only for regular users, not admins
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('error', 'Your session has expired. Please login again.')
      return NextResponse.redirect(loginUrl)
    }
    // Prevent admins from accessing user dashboard
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('error', 'Your session has expired. Please login again.')
      return NextResponse.redirect(loginUrl)
    }
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Protect API routes based on auth
  if (isApiRoute) {
    if (pathname.startsWith('/api/admin')) {
      if (!isLoggedIn || userRole !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else if (pathname.startsWith('/api/dashboard') || pathname.startsWith('/api/user')) {
      if (!isLoggedIn) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

