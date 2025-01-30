import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LinkButton } from '~/components/ui/link-button';
import { UserGamesTable } from '~/components/users/usergames-table';
import { getUnplayedScenarios } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
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

            <LinkButton href="/play" variant="outline" disabled={unplayedScenarios.length === 0}>
                {'Continue'}
            </LinkButton>

            <div className="mt-10">
                <span className="text-xs">{'Any comments? please, contact us'}</span>{' '}
                <Link
                    href="mailto:communication@DataBeacon.aero?subject=Comments about T5"
                    className="text-xs text-primary">
                    {'communication@DataBeacon.aero'}
                </Link>
            </div>
        </main>
    );
}
