import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export default function DashBoardLayout({ children }: PropsWithChildren) {
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

            <Link href={'/'} className="fixed bottom-4 right-4 z-10">
                <Settings />
            </Link>
            {children}
        </>
    );
}
