import Link from 'next/link';
import Image from 'next/image';
import { WelcomeTango5Title } from '~/components/ui/welcome-tango5-title';
import { FlightBackground } from '~/components/ui/flight-background';
import { LinkButton } from '~/components/ui/link-button';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        redirect('/scores');
    }

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
            <main className="map-background max-lg:hidden">
                <div className="relative flex flex-col items-center gap-2 p-6 md:p-20">
                    <WelcomeTango5Title />
                    <p className="w-[716px] text-center font-BarlowLight text-5xl text-background dark:text-foreground">
                        A professional enroute
                        <br />
                        Air Traffic Control training tool
                    </p>
                    <p className="mb-5 w-[700px] text-left font-BarlowLight text-3xl leading-10 text-background dark:text-foreground">
                        Whether you&apos;re dreaming of a career as an air traffic controller or simply curious about
                        how air traffic is controlled, Tango5 is your premier online destination for all things Air
                        Traffic Control (ATC).
                    </p>
                    <LinkButton href="/login" variant="map" className="px-5 py-6">
                        {'Get started'}
                        <Image
                            width="31"
                            height="25"
                            src="/images/arrow-full.svg"
                            alt="get started"
                            className="ml-3 inline-block"
                        />
                    </LinkButton>
                    <div className="mt-40">
                        <p className="text-center font-Barlow text-4xl text-background dark:text-foreground">
                            Who is it for?
                        </p>
                    </div>
                    <div className="isolate z-20 mt-8 flex w-full flex-row justify-between">
                        <div className="box h-[17rem] w-[17rem] rounded-3xl bg-translucent p-6 xl:h-[22rem] xl:w-[22rem] xl:p-9 2xl:h-96 2xl:w-96">
                            <div className="mb-5 flex flex-row items-end gap-4 2xl:mb-9">
                                <Image
                                    src="/images/candidates.svg"
                                    alt="ATCO Candidates"
                                    className="h-14 w-14 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24"
                                    width="64"
                                    height="64"
                                />
                                <span className="xl:pr-18 font-Barlow text-2xl leading-6 text-background dark:text-foreground xl:text-3xl xl:leading-7 2xl:text-4xl 2xl:leading-8">
                                    ATCO Candidates
                                </span>
                            </div>
                            <p className="font-BarlowLight text-lg leading-6 text-background dark:text-foreground xl:text-xl xl:leading-7">
                                A training tool to prepare for exams, gain valuable experience, and become familiar with
                                the world of Air Traffic Control.
                            </p>
                        </div>
                        <div className="box h-[17rem] w-[17rem] rounded-3xl bg-translucent p-6 xl:h-[22rem] xl:w-[22rem] xl:p-9 2xl:h-96 2xl:w-96">
                            <div className="mb-5 flex flex-row items-end gap-4 2xl:mb-9">
                                <Image
                                    src="/images/enthusiasts.svg"
                                    alt="Aviation enthusiasts"
                                    className="h-14 w-14 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24"
                                    width="64"
                                    height="64"
                                />
                                <span className="xl:pr-18 font-Barlow text-2xl leading-6 text-background dark:text-foreground xl:text-3xl xl:leading-7 2xl:text-4xl 2xl:leading-8">
                                    Aviation enthusiasts
                                </span>
                            </div>
                            <p className="font-BarlowLight text-lg leading-6 text-background dark:text-foreground xl:text-xl xl:leading-7">
                                Explore the intricate world of Air Traffic Control, we offer insights and knowledge to
                                enhance understanding and appreciation of the aviation industry.
                            </p>
                        </div>
                        <div className="box h-[17rem] w-[17rem] rounded-3xl bg-translucent p-6 xl:h-[22rem] xl:w-[22rem] xl:p-9 2xl:h-96 2xl:w-96">
                            <div className="mb-5 flex flex-row items-end gap-4 2xl:mb-9">
                                <Image
                                    src="/images/students.svg"
                                    alt="Students and graduates"
                                    className="h-14 w-14 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24"
                                    width="64"
                                    height="64"
                                />
                                <span className="xl:pr-18 font-Barlow text-2xl leading-6 text-background dark:text-foreground xl:text-3xl xl:leading-7 2xl:text-4xl 2xl:leading-8">
                                    Students and graduates
                                </span>
                            </div>
                            <p className="font-BarlowLight text-lg leading-6 text-background dark:text-foreground xl:text-xl xl:leading-7">
                                Tango5 provides further understanding of ATC operations, providing a unique perspective
                                on the integration of technology in the aviation industry.
                            </p>
                        </div>
                    </div>
                    <div className="mt-20">
                        <p className="text-center font-Barlow text-4xl text-background dark:text-foreground">
                            Do you want to know more?
                        </p>
                        <p className="text-center">
                            <Link
                                href={'mailto:communication@DataBeacon.aero'}
                                className="font-BarlowBold text-3xl text-background hover:underline dark:text-foreground">
                                Contact Us
                            </Link>
                        </p>
                    </div>
                    <FlightBackground />
                </div>
                <footer className="flex h-40 w-full flex-row items-center justify-between border-t border-t-map bg-translucent p-6 md:p-20">
                    <div className="flex flex-row justify-start gap-4">
                        <Image src="/images/tango5-logo.svg" width="26" height="34" alt="5" />
                        <Image src="/images/tango5.svg" width="150" height="38" alt="Tango5" />
                    </div>
                    <div className="flex flex-row items-center justify-start gap-5">
                        <Link href="https://databeacon.aero/" target="_blank">
                            <Image src="/images/databeacon.png" width="100" height="100" alt="DataBeacon" />
                        </Link>
                        <p className="font-BarlowLight text-sm text-background dark:text-foreground">
                            © 2025 DataBeacon
                        </p>
                    </div>
                    <div className="flex w-48 justify-end">
                        <Link href="https://www.linkedin.com/company/databeaconaero/" target="_blank">
                            <Image src="/images/linkedin.svg" width="38" height="38" alt="LinkedIn" />
                        </Link>
                    </div>
                </footer>
            </main>
        </>
    );
}
