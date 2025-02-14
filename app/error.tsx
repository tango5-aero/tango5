'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import posthog from 'posthog-js';
import { Button } from '~/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        posthog.captureException(error);
        console.error(error);
    }, [error]);

    return (
        <main className="flex flex-col items-center justify-center gap-5">
            <TriangleAlert size={64} />
            <h1 className="text-3xl font-bold">Something went wrong!</h1>
            <p className="text-xl text-muted-foreground">Sorry, there has been an unexpected error</p>
            <Button variant="outline" onClick={reset}>
                {'Try again'}
            </Button>
        </main>
    );
}
