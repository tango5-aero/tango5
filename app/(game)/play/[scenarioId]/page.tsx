import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { LogOutIcon } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { getScenario, getUnplayedScenarios } from '~/lib/db/queries';
import { Game } from '~/components/game/game';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

export default async function Page({ params }: { params: Promise<{ scenarioId: number }> }) {
    const id = (await params).scenarioId;
    if (isNaN(id)) notFound();

    const scenario = await getScenario(id);

    if (!scenario?.data) notFound();

    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const unplayedScenarios = (await getUnplayedScenarios(user.id)).length;

    return (
        <>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <Link href="/games">
                        <TooltipTrigger asChild>
                            <LogOutIcon className="fixed right-16 top-5 z-10 cursor-pointer text-white" />
                        </TooltipTrigger>
                    </Link>
                    <TooltipContent side="bottom" sideOffset={10} align="center">
                        <span className="text-sm text-white">{'Leave game'}</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Game id={id} unplayedScenarios={unplayedScenarios} scenarioData={scenario.data} nextUrl={'/play'} />
        </>
    );
}
