import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { checkBackStageAccess } from '../lib/roles';

export default async function Page() {
    const hasBackstageAccess = await checkBackStageAccess();

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
                    {hasBackstageAccess && <Link href="/backstage">Go to backstage</Link>}
                </main>
            </SignedIn>
        </>
    );
}
