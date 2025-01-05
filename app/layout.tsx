import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import { ThemeProvider } from '~/components/theme-provider';
import { PostHogProvider } from '~/components/posthog-provider';
import { UserBadge } from '~/components/user-badge';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html
                lang="en"
                suppressHydrationWarning /* https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app */
            >
                <body>
                    <PostHogProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            <UserBadge />
                            {children}
                        </ThemeProvider>
                    </PostHogProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
