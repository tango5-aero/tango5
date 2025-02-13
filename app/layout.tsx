import { Metadata } from 'next';
import { Barlow, B612 } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { tryCreateUser } from '~/lib/db/queries';
import { PostHogProvider } from '~/components/posthog/posthog-provider';
import { Toaster } from '~/components/ui/sonner';
import { SmallScreensProtection } from '~/components/ui/small-screens-protection';

import './globals.css';

export const metadata: Metadata = {
    title: 'Tango5 - Navigate air traffic',
    description:
        'Navigate air traffic with Tango5, an online training tool designed for those interested in air traffic control.',
    icons: {
        icon: [
            {
                media: '(prefers-color-scheme: light)',
                url: '/images/icon-dark.svg',
                href: '/images/icon-dark.svg'
            },
            {
                media: '(prefers-color-scheme: dark)',
                url: '/images/icon-light.svg',
                href: '/images/icon-light.svg'
            }
        ]
    }
};

const barlow = Barlow({
    weight: ['100', '300', '400', '700'],
    subsets: ['latin'],
    variable: '--font-barlow'
});

const b612 = B612({
    weight: ['400'],
    subsets: ['latin'],
    variable: '--font-b612'
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();
    if (user) {
        tryCreateUser(user.id);
    }

    return (
        <ClerkProvider>
            <html lang="en" className={`${barlow.variable} ${b612.variable}`}>
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
