import { SignedOut, SignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { getRandom, getScenarios, getUserGames, tryCreateUser } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        tryCreateUser(user);

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

    return (
        <main className="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
            <h1 className="text-3xl">{'Welcome to Tango5'}</h1>
            <SignedOut>
                <SignIn routing="hash" />
            </SignedOut>
            <Button variant="outline">
                <Link href="/play/random">Anonymous access</Link>
            </Button>
        </main>
    );
}
