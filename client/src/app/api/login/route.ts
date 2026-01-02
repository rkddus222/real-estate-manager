import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { password } = body;

    // 간단한 비밀번호 확인 (실제 운영 환경에서는 환경 변수로 관리하는 것이 좋습니다)
    if (password === 'admin1234') {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json(
        { message: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
    );
}
