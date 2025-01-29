import { currentUser } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { GameLayout } from '~/components/game/game-layout';
import { getScenario, getUnplayedScenarios } from '~/lib/db/queries';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    const id = (await params).scenarioId;
    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario?.data) notFound();

    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const unplayedScenarios = (await getUnplayedScenarios(user.id)).length;

    return <GameLayout id={id} unplayedScenarios={unplayedScenarios} scenarioData={scenario.data} />;
}
