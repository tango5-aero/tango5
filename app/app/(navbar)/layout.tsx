import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';

import { PropsWithChildren } from 'react';
import { Navbar } from '~/components/ui/navbar';

export default function DashBoardLayout({ children }: PropsWithChildren) {
    return (
        <>
            <Navbar />
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
