import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAdmin = request.cookies.has('admin_session');

    // 보호된 경로 확인
    if (request.nextUrl.pathname.startsWith('/add') ||
        request.nextUrl.pathname.startsWith('/edit')) {
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
};
