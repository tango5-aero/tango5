import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';

import { PropsWithChildren } from 'react';
import { SupportButton } from '~/components/ui/support-button';

export default function DashBoardLayout({ children }: PropsWithChildren) {
    return (
        <>
            <SupportButton />
            <div className="map-login fixed right-10 top-6 z-10">
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
