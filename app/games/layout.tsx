import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';

import { PropsWithChildren } from 'react';

export default function GamesLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="fixed right-4 top-5 z-10">
                <SignedOut>
                    <SignIn routing="hash" />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
            {children}
        </>
    );
}
