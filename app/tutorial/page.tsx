import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { TutorialCarousel } from '~/components/ui/tutorial-carousel';
import { VideoBackground } from '~/components/ui/video-background';

export default async function Page() {
    return (
        <>
            <div className="absolute right-5 top-5 z-40">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
            <main className="relative z-20 flex flex-col items-center justify-center gap-10 p-6 md:p-10">
                <Image src="/images/tango5.svg" width="304" height="63" alt="Tango5" />
                <TutorialCarousel />
                <div className="flex w-full flex-col gap-2">
                    <h2 className="mb-4 w-full text-center font-BarlowBold text-4xl">FAQ</h2>
                    <details className="w-full rounded-lg border border-map p-3">
                        <summary className="font-BarlowLight text-xl hover:cursor-pointer">What is Tango5?</summary>
                        <div className="mt-4 font-BarlowLight">
                            Tango5 (or T5 for short) is a suite of tools designed to enhance and challenge your Air
                            Traffic Control (ATC) skills.{' '}
                        </div>
                    </details>
                    <details className="w-full rounded-lg border border-map p-3">
                        <summary className="font-BarlowLight text-xl hover:cursor-pointer">What is Tango5?</summary>
                        <div className="mt-4 font-BarlowLight">
                            Tango5 (or T5 for short) is a suite of tools designed to enhance and challenge your Air
                            Traffic Control (ATC) skills.{' '}
                        </div>
                    </details>
                    <details className="w-full rounded-lg border border-map p-3">
                        <summary className="font-BarlowLight text-xl hover:cursor-pointer">What is Tango5?</summary>
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
            <VideoBackground />
        </>
    );
}
