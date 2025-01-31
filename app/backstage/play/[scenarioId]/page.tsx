import { notFound } from 'next/navigation';
import { getScenario } from '~/lib/db/queries';
import { Game } from '~/components/game/game';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    const id = (await params).scenarioId;
    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario?.data) notFound();

    return <Game backstageAccess scenario={scenario} />;
}
