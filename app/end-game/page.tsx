import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { UserGamesTable } from '~/components/users/usergames-table';
import { getUserGames } from '~/lib/db/queries';
import { UserGame } from '~/lib/db/schema';

export default async function Page() {
    const user = await currentUser();

    let userGames: UserGame[] = [];
    if (user) {
        userGames = await getUserGames(user.id);
    }

    return (
        <main className="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
            <h1 className="text-3xl">{'You have completed all available scenarios'}</h1>
            <h3 className="text-xl">{'Return later to access new scenarios'}</h3>
            <UserGamesTable usergames={userGames} />
            <Button variant="outline">
                <Link href="/play/random">Play random scenario</Link>
            </Button>
        </main>
    );
}
