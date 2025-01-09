import { ScenarioMap } from '~/components/scenario/scenario-map';
import { redirect } from 'next/navigation';
import { getScenario } from '~/lib/db/queries';
import { GameFinishDialog } from '~/components/game/game-finish-dialog';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    // TODO: if id is not a number, redirect to 404
    const id = (await params).scenarioId;

    const scenario = await getScenario(id);

    // TODO: redirect to 404 instead
    if (!scenario?.data) redirect('/');

    return (
        <>
            <GameFinishDialog open={true} score={0} />
            <ScenarioMap style={{ width: '100%', height: '100dvh' }} scenario={scenario.data} />
        </>
    );
}
