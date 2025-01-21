import { VideoBackground } from '~/components/ui/video-background';
import { WelcomeTango5Title } from '~/components/ui/welcome-tango5-title';

export default async function Page() {
    return (
        <>
            <main className="relative z-20 flex h-screen flex-col items-center justify-center gap-2 p-6 md:p-10">
                <WelcomeTango5Title />
                <p className="w-[490px] text-center font-BarlowLight text-4xl leading-10">
                    A professional enroute
                    <br />
                    Air Traffic Control training tool
                </p>
                <p className="mb-16 w-[460px] text-left font-Barlow text-xl leading-6">
                    Whether you’re aspiring to be an air traffic controller or just want to understand how air traffic
                    is managed, Tango5 is your ultimate online hub for all things ATC!
                </p>
                <a
                    href="/login"
                    className="h-12 rounded-full bg-map px-8 py-2 font-BarlowBold text-2xl font-bold leading-7 text-map-foreground shadow hover:bg-map/85">
                    LOGIN
                </a>
            </main>
            <VideoBackground />
        </>
    );
}
