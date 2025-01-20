import { notFound } from 'next/navigation';
import { Game } from '~/components/game/game';
import { getRandom } from '~/lib/db/queries';

export default async function Page() {
    const scenario = await getRandom();

    if (!scenario) notFound();

    return <Game id={scenario.id} scenario={scenario.data} nextUrl={'/random'} />;
}
