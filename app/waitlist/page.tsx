import { Waitlist } from '@clerk/nextjs';
import { VideoBackground } from '~/components/ui/video-background';
import { WelcomeTango5Title } from '~/components/ui/welcome-tango5-title';

export default function Page() {
    return (
        <>
            <main className="relative z-20 flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
                <WelcomeTango5Title />
                <Waitlist />
            </main>
            <VideoBackground />
        </>
    );
}
