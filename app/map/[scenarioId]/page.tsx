import { ScenarioMap } from '~/components/scenario-map';

import { getScenario } from '~/lib/db';
import { redirect } from 'next/navigation';
import { scenario } from '~/lib/scenario';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    const id = (await params).scenarioId;

    const storedScenario = await getScenario(id);

    if (!storedScenario?.data) redirect('/');

    const data = scenario.parse(JSON.parse(storedScenario.data));

    return <ScenarioMap style={{ width: '100%', height: '100dvh' }} scenario={data} />;
}
