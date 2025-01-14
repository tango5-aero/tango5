import { getRandom, getScenarios, getUserGames } from '~/lib/db/queries';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        const userGameScenarios = new Set((await getUserGames(user.id)).map((ug) => ug.scenarioId));
        const unplayedScenarios = (await getScenarios()).filter((s) => !userGameScenarios.has(s.id));

        if (unplayedScenarios.length == 0) {
            redirect('/end-game');
        }

        const scenario = await getRandom(unplayedScenarios.map((s) => s.id));

        if (!scenario) {
            notFound();
        }

        redirect(`/play/${scenario.id}`);
    }

    notFound();
}
