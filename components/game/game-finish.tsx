import Image from 'next/image';
import { getUserInfo } from '~/lib/actions/users';
import { Footer } from '~/components/ui/footer';
import { LinkButton } from '~/components/ui/link-button';
import { UserConsentForm } from '~/components/user/user-consent-form';

export async function GameFinish() {
    const userInfo = await getUserInfo();

    return (
        <>
            <main className="map-light-background flex flex-col items-center justify-center px-6 pb-8 pt-[100px] md:px-10 md:pb-12">
                <section className="justify-content mb-20 flex max-w-[1200px] items-end gap-8">
                    <Image
                        src="/images/tango5-logo.svg"
                        className="h-[132px] w-[110px] xl:h-[157px] xl:w-[131px] 2xl:h-[193px] 2xl:w-[161px]"
                        width="140"
                        height="168"
                        alt="Tango5 logo"
                    />
                    <div className="flex flex-col gap-4">
                        <span className="max-w-96 font-barlow text-4xl font-thin leading-none xl:text-5xl 2xl:text-6xl">
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
                </section>

                <section className="mb-10 space-y-4">
                    <div className="text-center font-barlow text-4xl font-light">Thanks for playing!</div>
                    <div className="text-center font-barlow text-xl font-light">
                        You have completed all the available scenarios
                    </div>
                </section>

                <LinkButton href="/app/scores" variant="map" size="map" className="mb-12">
                    See my scores
                </LinkButton>

                <UserConsentForm consent={userInfo?.consent} />
            </main>
            <Footer />
        </>
    );
}
