import { redirect } from 'next/navigation';
import { GameLayout } from '~/components/game/game-layout';
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
            <GameLayout scenario={scenario} remainingScenarios={demoScenarios.length} demoScenarios={demoScenarios} />;
        </>
    );
}
