import { NextResponse } from 'next/server'

export function middleware(req) {
  const token = req.cookies.get('accessToken')?.value
  const isAuthPage = req.nextUrl.pathname.startsWith('/login')

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login'], // Himoya qilish kerak bo'lgan sahifalar
}
