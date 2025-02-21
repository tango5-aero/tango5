import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { GameFinish } from '~/components/game/game-finish';
import { GameScene } from '~/components/game/game-scene';
import { getRandom, getUnplayedScenarios } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const unplayedScenarios = await getUnplayedScenarios(user.id);

    // if no remaining scenarios, show a thanks for playing message
    if (unplayedScenarios.length === 0) {
        return <GameFinish />;
    }

    const scenario = await getRandom(unplayedScenarios.map((s) => s.id));

    // this should never happen, take the user to summary page just in case
    if (!scenario) {
        redirect('/app/scores');
    }

    return <GameScene scenario={scenario} remainingScenarios={unplayedScenarios.length} />;
}
