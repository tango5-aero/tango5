import Link from 'next/link';
import { TutorialCarousel } from '~/components/ui/tutorial-carousel';
import { VideoBackground } from '~/components/ui/video-background';

export default async function Page() {
    return (
        <>
            <main className="relative z-20 flex flex-col items-center justify-center gap-12 p-12 md:p-10">
                <div className="flex flex-col items-center gap-6">
                    <TutorialCarousel />
                </div>
                <div className="flex w-full max-w-[1364px] flex-col gap-2">
                    <h2 className="mb-4 w-full text-center font-BarlowBold text-4xl" id="faq">
                        FAQ
                    </h2>
                    <details className="w-full rounded-full border border-map bg-map-foreground px-10 py-3">
                        <summary className="list-none font-BarlowLight text-xl hover:cursor-pointer">
                            What is Tango5?
                        </summary>
                        <div className="mt-4 font-BarlowLight">
                            Tango5 (or T5 for short) is a suite of tools designed to enhance and challenge your Air
                            Traffic Control (ATC) skills.{' '}
                        </div>
                    </details>
                </div>

                <Link
                    href="/play"
                    className="h-12 rounded-full bg-map px-8 py-2 font-BarlowBold text-2xl font-bold leading-7 text-map-foreground shadow hover:bg-map/85">
                    START
                </Link>
            </main>
            <VideoBackground colorBlend="light" />
        </>
    );
}
