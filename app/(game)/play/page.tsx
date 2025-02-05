import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Game } from '~/components/game/game';
import { getRandom, getUnplayedScenarios } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const unplayedScenarios = await getUnplayedScenarios(user.id);

    // if no remaining scenarios take the user to summary page
    if (unplayedScenarios.length === 0) {
        redirect('/scores');
    }

    const scenario = await getRandom(unplayedScenarios.map((s) => s.id));

    // this should never happen, take the user to summary page just in case
    if (!scenario) {
        redirect('/scores');
    }

    return <Game scenario={scenario} unplayedScenarios={unplayedScenarios.length} />;
}
