import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';

import { PropsWithChildren } from 'react';

export default function DashBoardLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="map-login fixed right-4 top-6 z-10">
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
