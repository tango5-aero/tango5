import { SignedOut, SignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { tryCreateUser } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        tryCreateUser(user);
        redirect('/play/random');
    }

    return (
        <main className="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
            <h1 className="text-3xl">{'Welcome to Tango5'}</h1>
            <SignedOut>
                <SignIn routing="hash" />
            </SignedOut>
            <Button variant="outline">
                <Link href="/play/random">Anonymous access</Link>
            </Button>
        </main>
    );
}
