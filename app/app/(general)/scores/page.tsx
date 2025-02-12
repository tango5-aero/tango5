import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { GamePerformance } from '~/components/game/game-performance';
import { LinkButton } from '~/components/ui/link-button';
import { UserGamesTable } from '~/components/usergame/usergames-table';
import { LoadingSpinner } from '~/components/ui/loading-spinner';
import { getUnplayedScenarios } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();
    if (!user) {
        redirect('/');
    }
    const unplayedScenarios = (await getUnplayedScenarios(user.id)).length;

    return (
        <main className="map-light-background flex flex-col items-center justify-center gap-6 px-6 pb-8 pt-[100px] md:px-10 md:pb-12">
            <Suspense
                fallback={
                    <div className="flex h-[90px] items-center justify-center">
                        <LoadingSpinner />
                    </div>
                }>
                <GamePerformance />
            </Suspense>

            <section className="mt-6">
                <UserGamesTable adminAccess={false} />
            </section>

            {unplayedScenarios > 0 ? (
                <p className="font-barlow text-xl font-light text-gray-300">
                    {`You have ${unplayedScenarios} new scenario${unplayedScenarios !== 1 ? 's' : ''}`}
                </p>
            ) : (
                <p className="font-barlow text-xl font-light text-gray-300">
                    {'Well done! You have completed all the scenarios'}
                </p>
            )}

            <LinkButton href="/app/play" variant="map" size="map" disabled={unplayedScenarios === 0}>
                {'Play'}
            </LinkButton>
        </main>
    );
}
