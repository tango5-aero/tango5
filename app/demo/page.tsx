import { redirect } from 'next/navigation';
import { UserGame } from '~/components/usergame/usergame';
import { getDemoScenarios } from '~/lib/db/queries';

export default async function Page() {
    const demoScenarios = await getDemoScenarios();
    const scenario = demoScenarios[0];

    // this should never happen, take the user to summary page just in case
    if (!scenario) {
        redirect('/');
    }

    return <UserGame scenario={scenario} remainingScenarios={demoScenarios.length} demoScenarios={demoScenarios} />;
}
