import { ScenarioMap } from '~/components/scenario/scenario-map';
import { redirect } from 'next/navigation';
import { getScenarios } from '~/lib/db/queries';

export default async function Page() {
    const scenarios = await getScenarios();

    const randomIndex = Math.floor(Math.random() * scenarios.length);

    const scenario = scenarios.at(randomIndex);

    // TODO: redirect to 404 instead
    if (!scenario) redirect('/');

    return <ScenarioMap style={{ width: '100%', height: '100dvh' }} scenario={scenario.data} />;
}
