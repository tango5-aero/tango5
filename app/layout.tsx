import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from '~/providers/post-hog';

import './globals.css';
import { Suspense } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <CSPostHogProvider>
                <Suspense>
                    <html lang="en">
                        <body>{children}</body>
                    </html>
                </Suspense>
            </CSPostHogProvider>
        </ClerkProvider>
    );
}
