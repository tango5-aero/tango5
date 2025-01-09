import { checkRole } from '~/lib/roles';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function Page() {
    const isAdmin = await checkRole('admin');

    return (
        <>
            <SignedOut>
                <main className="flex h-svh items-center justify-center">
                    <SignIn routing="hash" />
                </main>
            </SignedOut>
            <SignedIn>
                <main className="flex h-svh flex-col items-center justify-center">
                    <UserButton />
                    <Link href="/play/random">Play random</Link>
                    {isAdmin && <Link href="/backstage">Go to backstage</Link>}
                </main>
            </SignedIn>
        </>
    );
}
