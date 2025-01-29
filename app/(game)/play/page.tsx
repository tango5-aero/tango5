import { getRandom, getUnplayedScenarios } from '~/lib/db/queries';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const unplayedScenarios = await getUnplayedScenarios(user.id);

    // if no remaining scenarios take the user to summary page
    if (unplayedScenarios.length == 0) {
        redirect('/games');
    }

    const scenario = await getRandom(unplayedScenarios.map((s) => s.id));

    // this should never happen, take the user to summary page just in case
    if (!scenario) {
        redirect('/games');
    }

    redirect(`/play/${scenario.id}`);
}
