import Link from 'next/link';
import { VideoBackground } from '~/components/ui/video-background';
import { WelcomeTango5Title } from '~/components/ui/welcome-tango5-title';

export default async function Page() {
    return (
        <>
            <main className="flex h-[100dvh] flex-col items-center justify-center gap-6 px-5 lg:hidden">
                <h2 className="text-xl sm:text-2xl">Screen Size Not Supported</h2>
                <p className="text-pretty text-sm sm:text-base">
                    This application requires a minimum screen width of 1024 pixels to function properly.
                </p>
                <p className="text-pretty text-sm sm:text-base">
                    Please resize your browser window or switch to a device with a larger screen.
                </p>
            </main>
            <main className="max-lg:hidden">
                <div className="relative z-20 flex h-screen flex-col items-center justify-center gap-2 p-6 md:p-10">
                    <WelcomeTango5Title />
                    <p className="w-[490px] text-center font-BarlowLight text-4xl leading-10">
                        A professional enroute
                        <br />
                        Air Traffic Control training tool
                    </p>
                    <p className="mb-5 w-[460px] text-left font-Barlow text-xl leading-6">
                        Whether you’re aspiring to be an air traffic controller or just want to understand how air
                        traffic is managed, Tango5 is your ultimate online hub for all things ATC!
                    </p>
                    <Link
                        href="/login"
                        className="h-12 rounded-full bg-map px-8 py-2 font-BarlowBold text-2xl font-bold leading-7 text-map-foreground shadow hover:bg-map/85">
                        {'Log in >'}
                    </Link>
                </div>
                <VideoBackground />
            </main>
        </>
    );
}
