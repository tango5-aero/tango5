import { notFound } from 'next/navigation';
import { getScenario, getUnplayedScenarios } from '~/lib/db/queries';
import { Game } from '~/components/game/game';
import { currentUser } from '@clerk/nextjs/server';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    const id = (await params).scenarioId;
    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario?.data) notFound();

    const user = await currentUser();

    if (!user) {
        return <Game id={id} unplayedScenarios={undefined} scenarioData={scenario.data} nextUrl={'/play'} />;
    }

    const unplayedScenarios = (await getUnplayedScenarios(user.id)).length;

    return <Game id={id} unplayedScenarios={unplayedScenarios} scenarioData={scenario.data} nextUrl={'/play'} />;
}
