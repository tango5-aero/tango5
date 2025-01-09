import { redirect } from 'next/navigation';
import { getScenario } from '~/lib/db/queries';
import { Game } from '~/components/game/game';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    // TODO: if id is not a number, redirect to 404
    const id = (await params).scenarioId;

    const scenario = await getScenario(id);

    // TODO: redirect to 404 instead
    if (!scenario?.data) redirect('/');

    return <Game scenario={scenario.data} />;
}
