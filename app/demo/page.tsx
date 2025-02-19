import { redirect } from 'next/navigation';
import { UserGame } from '~/components/usergame/usergame';
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

    return <UserGame scenario={scenario} unplayedScenarios={demoScenarios.length} />;
}
