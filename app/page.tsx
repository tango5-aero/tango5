import Link from 'next/link';
import Image from 'next/image';
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
                <div className="relative z-20 flex flex-col items-center gap-2 p-6 md:p-20">
                    <WelcomeTango5Title />
                    <p className="w-[716px] text-center font-BarlowLight text-5xl">
                        A professional enroute
                        <br />
                        Air Traffic Control training tool
                    </p>
                    <p className="mb-5 w-[700px] text-left font-BarlowLight text-3xl leading-10">
                        Whether you’re aspiring to be an air traffic controller or just want to understand how air
                        traffic is managed, Tango5 is your ultimate online hub for all things ATC!
                    </p>
                    <div className="flex flex-row gap-9">
                        <Link
                            href="/login"
                            className="rounded-full border-2 border-map px-8 py-2 font-Barlow text-2xl font-bold leading-7 text-map shadow hover:bg-map/85">
                            {'Join our waitlist'}
                            <img src="/images/arrow-empty.svg" alt="Join our waitlist" className="ml-3 inline-block" />
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-full bg-map px-8 py-2 font-BarlowBold text-2xl font-bold leading-7 text-map-foreground shadow hover:bg-map/85">
                            {'Log in'}
                            <img src="/images/arrow-full.svg" alt="Log in" className="ml-3 inline-block" />
                        </Link>
                    </div>
                    <div className="mt-20">
                        <p className="text-center font-Barlow text-4xl">Un título que hable de</p>
                        <p className="text-center font-BarlowBold text-4xl">a quién va dirigido esto</p>
                    </div>
                    <div className="mt-8 flex w-full flex-row justify-between">
                        <div className="box h-64 w-64 rounded-3xl bg-translucent p-7 xl:h-[22rem] xl:w-[22rem] xl:px-9 xl:py-11">
                            <Image
                                src="/images/candidates.svg"
                                alt="ATCO Candidates"
                                className="mb-3 h-16 w-16 xl:mb-5 xl:h-24 xl:w-24"
                                width="64"
                                height="64"
                            />
                            <p className="mb-3 font-Barlow text-xl leading-6 xl:pr-20 xl:text-3xl xl:leading-8">
                                ATCO Candidates
                            </p>
                            <p className="font-BarlowLight leading-5 xl:text-xl xl:leading-6">
                                Lorem fistrum pecador nisi et se calle ustée papaar papaar va usté muy cargadoo.
                            </p>
                        </div>
                        <div className="box h-64 w-64 rounded-3xl bg-translucent p-7 xl:h-[22rem] xl:w-[22rem] xl:px-9 xl:py-11">
                            <Image
                                src="/images/enthusiasts.svg"
                                alt="Aviation enthusiasts"
                                className="mb-3 h-16 w-16 xl:mb-5 xl:h-24 xl:w-24"
                                width="64"
                                height="64"
                            />
                            <p className="mb-3 font-Barlow text-xl leading-6 xl:pr-14 xl:text-3xl xl:leading-8">
                                Aviation enthusiasts
                            </p>
                            <p className="font-BarlowLight leading-5 xl:text-xl xl:leading-6">
                                Lorem fistrum pecador nisi et se calle ustée papaar papaar va usté muy cargadoo.
                            </p>
                        </div>
                        <div className="box h-64 w-64 rounded-3xl bg-translucent p-7 xl:h-[22rem] xl:w-[22rem] xl:px-9 xl:py-11">
                            <Image
                                src="/images/candidates.svg"
                                alt="Students and graduates"
                                className="mb-3 h-16 w-16 xl:mb-5 xl:h-24 xl:w-24"
                                width="64"
                                height="64"
                            />
                            <p className="mb-3 font-Barlow text-xl leading-6 xl:text-3xl xl:leading-8">
                                Students and graduates
                            </p>
                            <p className="font-BarlowLight leading-5 xl:text-xl xl:leading-6">
                                Lorem fistrum pecador nisi et se calle ustée papaar papaar va usté muy cargadoo.
                            </p>
                        </div>
                    </div>
                    <div className="mt-20">
                        <p className="text-center font-Barlow text-4xl">Do you want to know more?</p>
                        <p className="text-center">
                            <Link
                                href={'mailto:communication@DataBeacon.aero'}
                                className="font-BarlowBold text-3xl hover:underline">
                                Contact Us
                            </Link>
                        </p>
                    </div>
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
                        <p className="font-BarlowLight text-sm">© 2025 DataBeacon</p>
                    </div>
                    <div className="flex w-48 justify-end">
                        <Link href="linkedin" target="_blank">
                            <Image src="/images/linkedin.svg" width="38" height="38" alt="LinkedIn" />
                        </Link>
                    </div>
                </footer>
                <VideoBackground />
            </main>
        </>
    );
}
