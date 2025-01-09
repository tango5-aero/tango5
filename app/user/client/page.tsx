'use client';

import { useUser } from '@clerk/nextjs';

export default function Home() {
    const { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded) {
        // Handle loading state
        return null;
    }

    if (isSignedIn) {
        return <pre>{JSON.stringify(user, null, 2)}</pre>;
    }

    return <div>Not signed in</div>;
}
