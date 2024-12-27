import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from './providers';

import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <CSPostHogProvider>
            <ClerkProvider>
                <html lang="en">
                    <body>{children}</body>
                </html>
            </ClerkProvider>
        </CSPostHogProvider>
    );
}
