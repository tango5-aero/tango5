import { ClerkProvider } from '@clerk/nextjs';
import { PostHogProvider } from '~/components/posthog/posthog-provider';
import { Toaster } from '~/components/ui/sonner';
import { currentUser } from '@clerk/nextjs/server';
import { tryCreateUser } from '~/lib/db/queries';

import './globals.css';
import { SmallScreensProtection } from '~/components/ui/small-screens-protection';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();
    if (user) {
        tryCreateUser(user.id);
    }

    return (
        <ClerkProvider>
            <html lang="en">
                <body>
                    <PostHogProvider>
                        <SmallScreensProtection>{children}</SmallScreensProtection>
                        <Toaster expand={true} />
                    </PostHogProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
