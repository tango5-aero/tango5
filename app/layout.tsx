import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '~/components/theme/theme-provider';
import { PostHogProvider } from '~/components/posthog/posthog-provider';
import { Toaster } from '~/components/ui/sonner';
import { currentUser } from '@clerk/nextjs/server';
import { tryCreateUser } from '~/lib/db/queries';

import './globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();

    if (user) {
        tryCreateUser(user);
    }

    return (
        <ClerkProvider>
            <html
                lang="en"
                suppressHydrationWarning /* https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app */
            >
                <body>
                    <PostHogProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            {children}
                            <Toaster expand={true} />
                        </ThemeProvider>
                    </PostHogProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
