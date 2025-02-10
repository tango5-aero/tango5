import { SignedOut, SignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { VideoBackground } from '~/components/ui/video-background';
import { WelcomeTango5Title } from '~/components/ui/welcome-tango5-title';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        redirect('/app/play');
    }

    return (
        <>
            <main className="relative z-20 flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
                <WelcomeTango5Title />
                <SignedOut>
                    <SignIn routing="hash" forceRedirectUrl={'/app/'} />
                </SignedOut>
            </main>
            <VideoBackground />
        </>
    );
}
