'use client';

import Link from 'next/link';

export default function Status404() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="mb-4 text-6xl font-bold text-gray-300">404</h1>
            <p className="mb-8 text-xl text-gray-600">Nothing here yet</p>
            <div className="border-2 border-solid">
                <Link href="/" className="mb-8 px-4 py-2 text-gray-300">
                    Get me to a safe place
                </Link>
            </div>
        </div>
    );
}
