// Adapted from https://posthog.com/docs/libraries/next-js#capturing-pageviews
// and https://clerk.com/blog/how-to-use-clerk-with-posthog-identify-in-nextjs

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useAuth, useUser } from '@clerk/nextjs';

function PostHogPageView(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const posthog = usePostHog();

    const { isSignedIn, userId } = useAuth();
    const { user } = useUser();

    // Identify users between clerk and PpstHog
    useEffect(() => {
        if (isSignedIn && userId && user && !posthog._isIdentified()) {
            posthog.identify(userId, {
                email: user.primaryEmailAddress?.emailAddress,
                username: user.username
            });
        }

        if (!isSignedIn && posthog._isIdentified()) {
            posthog.reset();
        }
    }, [posthog, user, isSignedIn, userId]);

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname;
            if (searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }

            posthog.capture('$pageview', { $current_url: url });
        }
    }, [pathname, searchParams, posthog]);

    return null;
}

// Wrap this in Suspense to avoid the `useSearchParams` usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
export default function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    );
}
