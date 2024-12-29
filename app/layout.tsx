import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from '~/providers/post-hog';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <CSPostHogProvider>
                <html lang="en">
                    <body>{children}</body>
                </html>
            </CSPostHogProvider>
        </ClerkProvider>
    );
}
