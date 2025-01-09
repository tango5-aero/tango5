import { ScenarioMap } from '~/components/scenario/scenario-map';
import { notFound } from 'next/navigation';
import { getRandom } from '~/lib/db/queries';

export default async function Page() {
    const scenario = await getRandom();

    if (!scenario) notFound();

    return <ScenarioMap style={{ width: '100%', height: '100dvh' }} scenario={scenario.data} />;
}
