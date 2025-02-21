import { redirect } from 'next/navigation';
import { GameScene } from '~/components/game/game-scene';
import { SupportButton } from '~/components/ui/support-button';
import { getDemoScenarios } from '~/lib/db/queries';

export default async function Page() {
    const demoScenarios = await getDemoScenarios();
    const scenario = demoScenarios[demoScenarios.length - 1];

    // this should never happen, take the user to summary page just in case
    if (!scenario) {
        redirect('/');
    }

    return (
        <>
            <SupportButton />
            <GameScene scenario={scenario} remainingScenarios={demoScenarios.length} demoScenarios={demoScenarios} />;
        </>
    );
}
