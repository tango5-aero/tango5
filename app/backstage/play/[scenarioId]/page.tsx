import { notFound } from 'next/navigation';
import { GameLayout } from '~/components/game/game-layout';
import { getScenario } from '~/lib/db/queries';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    const id = (await params).scenarioId;
    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario?.data) notFound();

    return <GameLayout disableNext id={id} scenarioData={scenario.data} exitUrl="/backstage/scenarios" />;
}
