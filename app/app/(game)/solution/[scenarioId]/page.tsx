import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { GameLayout } from '~/components/game/game-layout';
import { checkGameIsPlayed, getScenario } from '~/lib/db/queries';

type Params = Promise<{ scenarioId: number }>;

export default async function Page({ params }: { params: Params }) {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const id = (await params).scenarioId;

    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario) notFound();

    const scenarioIsPlayed = await checkGameIsPlayed(id);

    if (!scenarioIsPlayed) notFound();

    return <GameLayout revealSolution scenario={scenario} />;
}
