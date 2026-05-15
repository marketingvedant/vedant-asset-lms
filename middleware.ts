import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('Middleware running for:', request.nextUrl.pathname)
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('User in middleware:', user?.email || 'No user')

  // Get user profile to check role
  let userProfile = null
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    userProfile = profile
    console.log('Profile in middleware:', profile?.role || 'No profile')
    
    // If user exists but no profile, and they're not on auth pages, redirect to create profile
    if (!profile && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup') && !request.nextUrl.pathname.startsWith('/debug')) {
      console.log('User without profile detected, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || userProfile?.role !== 'admin') {
      console.log('Protecting admin route, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect student routes
  if (request.nextUrl.pathname.startsWith('/student')) {
    if (!user) {
      console.log('Protecting student route, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && userProfile && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    console.log('Redirecting authenticated user away from auth pages')
    if (userProfile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/student/dashboard', request.url))
    }
  }

  console.log('Middleware allowing request to continue')
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}