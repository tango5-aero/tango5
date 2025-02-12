// Adapted from https://posthog.com/docs/libraries/next-js#router-specific-instructions

'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import PostHogPageView from './posthog-pageview';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
            ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            api_host: '/ingest',
            capture_pageview: false, // Disable automatic pageview capture, as we capture manually
            capture_pageleave: true
        });
    }, []);

    return (
        <PHProvider client={posthog}>
            <PostHogPageView />
            {children}
        </PHProvider>
    );
}
