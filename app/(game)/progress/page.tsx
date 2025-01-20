import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { UserResetAction } from '~/components/user/user-reset-action';
import { UserGamesTable } from '~/components/users/usergames-table';
import { getUnplayedScenarios, getUserGames } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const userGames = await getUserGames(user.id);

    if (userGames.length === 0) {
        redirect('/play');
    }

    const unplayedScenarios = await getUnplayedScenarios(user.id);

    const isAllDone = unplayedScenarios.length == 0;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
            {isAllDone && <h1 className="text-3xl">{'You have completed all available scenarios'}</h1>}
            {isAllDone && <h3 className="text-xl">{'Return later to access new scenarios'}</h3>}
            <UserGamesTable usergames={userGames} allowDeleteGames={false} />
            <div className="flex flex-row gap-2">
                <Button disabled={unplayedScenarios.length === 0} variant="outline">
                    <Link href="/play">Continue</Link>
                </Button>
                <UserResetAction id={user.id} />
            </div>
        </main>
    );
}
