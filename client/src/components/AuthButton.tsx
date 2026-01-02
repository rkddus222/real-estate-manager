"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch('/api/me');
                if (res.ok) {
                    const data = await res.json();
                    setIsLoggedIn(data.isLoggedIn);
                }
            } catch (error) {
                console.error("Auth check failed", error);
            }
        };
        checkLogin();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            setIsLoggedIn(false);
            router.refresh();
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (isLoggedIn) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                    관리자님
                </span>
                <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    로그아웃
                </button>
            </div>
        );
    }

    return (
        <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
            관리자 로그인
        </Link>
    );
}
