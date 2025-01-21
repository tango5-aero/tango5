import { SignedOut, SignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
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
            <div className="absolute left-0 top-0 z-10 h-full w-full bg-[#20282E] mix-blend-color"></div>
            <video
                autoPlay
                loop
                muted
                className="absolute left-0 top-0 z-0 h-full w-full object-cover opacity-70"
                src="./video/databeacon-bg.mp4"></video>
            <div className="absolute left-0 top-0 z-0 h-full w-full bg-[#011B26] opacity-50"></div>
        </>
    );
}
