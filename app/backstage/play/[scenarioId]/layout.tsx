import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { PropsWithChildren } from 'react';

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    return (
        <>
            <div className="map-login fixed right-4 top-6 z-10">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            {children}
        </>
    );
}
