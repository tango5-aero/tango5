import Image from 'next/image';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { BoxInfo } from '~/components/ui/box-info';
import { FlightBackground } from '~/components/ui/flight-background';
import { LinkButton } from '~/components/ui/link-button';

const boxItems = [
    {
        title: 'ANSPs',
        subTitle: `Objective radar controller's selection`,
        description: (
            <>
                <p>Tango5 could be an integral part of the potential controllers’ selection exam.</p>
                <p>
                    It uses real traffic data, with adaptability based on desired parameters like scenario complexity,
                    and is very easy to explain to candidates, ensuring a fair and thorough selection process.
                </p>
            </>
        ),
        image: '/images/ansps.svg'
    },
    {
        title: 'ATCO candidates',
        subTitle: 'Real skills for real exams',
        description: (
            <>
                <p>
                    For ATCO candidates, practicing with Tango5 isn’t just about passing an exam; it’s about honing your
                    conflict detection skills with real traffic scenarios.
                </p>
                <p>
                    This practical approach not only prepares you for the test but also enhances your adaptation to ATC
                    training, ensuring your study time is invested wisely.
                </p>
            </>
        ),
        image: '/images/candidates.svg'
    },
    {
        title: 'ATC students',
        subTitle: 'Less or easier SIM time with practice',
        description: (
            <>
                <p>
                    Tango5 provides a deeper understanding of ATC operations, focusing on conflict detection — one of
                    the toughest tasks for radar controllers.
                </p>
                <p>
                    It can be an integral part of training before moving to the simulator, using scenarios based on
                    real-world situations.
                </p>
            </>
        ),
        image: '/images/students.svg'
    },
    {
        title: 'Enthusiasts',
        subTitle: `Inside the controller's mind`,
        description: (
            <p>
                For aviation enthusiasts, Tango5 offers a glimpse into how enroute radar controllers manage the skies,
                making the complex world of air traffic control more accessible and engaging.
            </p>
        ),
        image: '/images/enthusiasts.svg'
    }
];

export default async function Page() {
    const user = await currentUser();

    return (
        <main className="relative flex min-h-screen flex-col bg-[url('/images/map.jpg')] bg-center bg-no-repeat">
            <div className="my-20 flex flex-col items-center gap-20 p-6">
                <section className="justify-content flex max-w-[1200px] items-end gap-8">
                    <Image
                        src="/images/tango5-logo.svg"
                        className="h-[132px] w-[110px] xl:h-[157px] xl:w-[131px] 2xl:h-[193px] 2xl:w-[161px]"
                        width="140"
                        height="168"
                        alt="Tango 5 logo"
                    />
                    <div className="flex flex-col gap-4">
                        <span className="max-w-96 font-barlow text-4xl font-thin leading-none text-background xl:text-5xl 2xl:text-6xl">
                            Navigate <br /> air traffic with
                        </span>
                        <Image
                            src="/images/tango5.svg"
                            className="h-[51px] w-[249px] xl:h-[58px] xl:w-[292px] 2xl:h-[73px] 2xl:w-[356px]"
                            width="356"
                            height="73"
                            alt="Tango5"
                        />
                    </div>
                    <div className="flex max-w-[600px] flex-col gap-6 text-pretty font-barlow text-2xl font-light leading-[1.2] text-background xl:text-3xl 2xl:text-[32px]">
                        <p className="pr-10">
                            Tango 5 is an online training tool designed for those interested in air traffic control.
                        </p>
                        <p>It uses real scenarios to help users learn how to detect conflicts on radar.</p>
                    </div>
                </section>

                <LinkButton href={user ? '/play' : '/login'} variant="map" className="z-20 px-6 py-8 text-3xl">
                    <div className="flex items-center gap-2">
                        {'PLAY'}
                        <Image width="22" height="17" src="/images/arrow-full.svg" alt="Play Tango5" />
                    </div>
                </LinkButton>

                <section className="z-20 text-center font-barlow text-4xl font-thin text-background xl:text-5xl 2xl:text-6xl">
                    Who is it for?
                </section>

                <section className="z-20 flex w-full justify-center gap-4 xl:gap-8 2xl:gap-12">
                    {boxItems.map((boxItem, index) => (
                        <BoxInfo key={index} {...boxItem} />
                    ))}
                </section>
            </div>

            <section className="z-20 mb-28 mt-10 flex items-center justify-center gap-4">
                <Image
                    src="/images/developed-by.png"
                    className="h-[80px] w-[350px] xl:h-[90px] xl:w-[392px] 2xl:h-[100px] 2xl:w-[436px]"
                    width="436"
                    height="100"
                    alt="Tango 5: developed by DataBeacon"
                />
                <div className="flex flex-col gap-2.5 font-barlow text-2xl font-light text-background xl:text-3xl 2xl:text-4xl">
                    <p>Do you want to know more?</p>
                    <p>
                        <Link className="font-bold hover:underline" href="https://databeacon.aero" target="_blank">
                            Visit our website
                        </Link>{' '}
                        or{' '}
                        <Link
                            className="font-bold hover:underline"
                            href="mailto:communication@DataBeacon.aero?subject=Comments about T5"
                            target="_blank">
                            contact us
                        </Link>
                    </p>
                </div>
            </section>

            <footer className="mt-auto flex w-full flex-row items-center justify-between bg-translucent px-10 py-6">
                <Link href="https://databeacon.aero/" target="_blank">
                    <Image src="/images/databeacon.png" width="100" height="100" alt="DataBeacon" />
                </Link>
                <div className="flex flex-row items-center justify-start gap-5">
                    <p className="font-barlow text-sm font-light text-background">© 2025 DataBeacon</p>
                </div>
                <div className="flex w-48 justify-end">
                    <Link href="https://www.linkedin.com/company/databeaconaero/" target="_blank">
                        <Image src="/images/linkedin.svg" width="30" height="30" alt="LinkedIn" />
                    </Link>
                </div>
            </footer>

            <FlightBackground />
        </main>
    );
}
