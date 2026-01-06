import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ['/chat'];
    const authRoutes = ['/login', '/signup'];

    // If user is authenticated and tries to access auth pages, redirect to chat
    if (token && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/chat', request.url));
    }

    // If user is not authenticated and tries to access protected routes, redirect to login
    if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/chat/:path*', '/login', '/signup'],
};
