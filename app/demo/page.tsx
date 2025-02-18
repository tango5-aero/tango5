import { redirect } from 'next/navigation';
import { Game } from '~/components/game/game';
import { getDemoScenarios, getRandom } from '~/lib/db/queries';

export default async function Page() {
    const demoScenarios = await getDemoScenarios();

    // if no remaining scenarios, show a thanks for playing message
    if (demoScenarios.length === 0) {
        redirect('/');
    }

    const scenario = await getRandom(demoScenarios.map((s) => s.id));

    // this should never happen, take the user to summary page just in case
    if (!scenario) {
        redirect('/');
    }

    return <Game scenario={scenario} unplayedScenarios={demoScenarios.length} />;
}
