import { ClerkProvider } from '@clerk/nextjs';
import { PostHogProvider } from '~/components/posthog/posthog-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html
                lang="en"
                suppressHydrationWarning /* https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app */
            >
                <body>
                    <PostHogProvider>{children}</PostHogProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
