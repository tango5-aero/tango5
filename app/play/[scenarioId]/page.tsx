import { ScenarioMap } from '~/components/scenario/scenario-map';
import { notFound } from 'next/navigation';
import { getScenario } from '~/lib/db/queries';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    const id = (await params).scenarioId;
    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario?.data) notFound();

    return <ScenarioMap style={{ width: '100%', height: '100dvh' }} scenario={scenario.data} />;
}
