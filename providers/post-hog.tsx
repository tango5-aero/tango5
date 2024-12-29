'use client';

import { useEffect, PropsWithChildren, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { usePostHog, PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';

export default function PostHogPageView(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const posthog = usePostHog();

    const { isSignedIn, userId } = useAuth();
    const { user } = useUser();

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname;
            if (searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            posthog.capture('$pageview', {
                $current_url: url
            });
        }
    }, [pathname, searchParams, posthog]);

    // identify Clerk user in PostHog
    useEffect(() => {
        if (isSignedIn && userId && user && !posthog._isIdentified()) {
            posthog.identify(userId, {
                email: user.primaryEmailAddress?.emailAddress,
                username: user.username
            });
        }
    }, [isSignedIn, posthog, user, userId]);

    return null;
}

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'always'
    });
}
export function CSPostHogProvider({ children }: PropsWithChildren) {
    return (
        <PostHogProvider client={posthog}>
            <Suspense>
                <PostHogPageView />
            </Suspense>
            {children}
        </PostHogProvider>
    );
}
