import { getRandom, getUnplayedScenarios } from '~/lib/db/queries';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        const unplayedScenarios = await getUnplayedScenarios(user.id);

        if (unplayedScenarios.length == 0) {
            redirect('/games');
        }

        const scenario = await getRandom(unplayedScenarios.map((s) => s.id));

        if (!scenario) {
            notFound();
        }

        redirect(`/play/${scenario.id}`);
    }

    redirect('/play/random');
}
