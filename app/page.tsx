import { SignedOut, SignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { VideoBackground } from '~/components/ui/video-background';
import { tryCreateUser } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        tryCreateUser(user);
        redirect('/games');
    }

    return (
        <>
            <main className="relative z-20 flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
                <h1 className="text-3xl">{'Welcome to Tango5'}</h1>
                <SignedOut>
                    <SignIn routing="hash" />
                </SignedOut>
            </main>
            <VideoBackground />
        </>
    );
}
