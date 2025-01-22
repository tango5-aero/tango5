import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { VideoBackground } from '~/components/ui/video-background';
import { WelcomeTango5Title } from '~/components/ui/welcome-tango5-title';

export default async function Page() {
    return (
        <>
            <div className="absolute right-5 top-5 z-40">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
            <main className="relative z-20 flex h-screen flex-col items-center justify-center gap-10 p-6 md:p-10">
                <WelcomeTango5Title />
                <Link
                    href="/tutorial"
                    className="h-12 rounded-full bg-map px-8 py-2 font-BarlowBold text-2xl font-bold leading-7 text-map-foreground shadow hover:bg-map/85">
                    WATCH TUTORIAL
                </Link>
                <Link
                    href="/play"
                    className="h-12 rounded-full bg-map px-8 py-2 font-BarlowBold text-2xl font-bold leading-7 text-map-foreground shadow hover:bg-map/85">
                    START
                </Link>
            </main>
            <VideoBackground />
        </>
    );
}
