import { notFound } from 'next/navigation';
import { getScenario } from '~/lib/db/queries';
import { GameLayout } from '~/components/game/game-layout';

type Params = Promise<{ scenarioId: number }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
    const id = (await params).scenarioId;
    const showSolution = (await searchParams).solution === 'true';

    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario?.data) notFound();

    return <GameLayout backstageAccess scenario={scenario} revealSolution={showSolution} />;
}
