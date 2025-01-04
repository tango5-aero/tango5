import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from '~/components/post-hog';
import { ThemeProvider } from 'next-themes';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <CSPostHogProvider>
                <html lang="en">
                    <body>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            {children}
                        </ThemeProvider>
                    </body>
                </html>
            </CSPostHogProvider>
        </ClerkProvider>
    );
}
