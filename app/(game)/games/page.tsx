import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { UserGamesTable } from '~/components/users/usergames-table';
import { getUnplayedScenarios, getUserGames } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const userGames = await getUserGames(user.id);

    // if the user hasn't played any scenarios start playing inmediately
    if (userGames.length === 0) {
        redirect('/play');
    }

    const unplayedScenarios = await getUnplayedScenarios(user.id);

    const isAllDone = unplayedScenarios.length == 0;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
            {isAllDone && <h1 className="text-3xl">{'You have completed all available scenarios'}</h1>}
            {isAllDone && <h3 className="text-xl">{'Return later to access new scenarios'}</h3>}

            {!isAllDone && <h1 className="text-3xl">{`You have available scenarios`}</h1>}
            {!isAllDone && (
                <h3 className="text-xl">{`Keep playing to complete ${unplayedScenarios.length} remaining scenarios`}</h3>
            )}

            <UserGamesTable adminAccess={false} />
            <div className="flex flex-row gap-2">
                <Link href="/play" passHref>
                    <Button disabled={unplayedScenarios.length === 0} variant="outline">
                        {'Continue'}
                    </Button>
                </Link>
            </div>

            <div>
                <h3 className="text-xl">{'Keep me posted for new scenarios'}</h3>
                <Input type="text" value="pepito@test.com" />
                <Button>Submit</Button>
            </div>
        </main>
    );
}
