import Link from 'next/link';
import { PropsWithoutRef } from 'react';
import { LogOutIcon } from 'lucide-react';
import { ScenarioData } from '~/lib/domain/scenario';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui/tooltip';
import { Game } from '~/components/game/game';

type GameLayoutProps = {
    id: number;
    unplayedScenarios?: number;
    scenarioData: ScenarioData;
    disableNext?: boolean;
    exitUrl?: string;
};

export const GameLayout = (props: PropsWithoutRef<GameLayoutProps>) => {
    return (
        <>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <Link href={props.exitUrl ?? '/games'}>
                        <TooltipTrigger asChild>
                            <LogOutIcon className="fixed right-16 top-5 z-10 cursor-pointer text-white" />
                        </TooltipTrigger>
                    </Link>
                    <TooltipContent side="bottom" sideOffset={10} align="center">
                        <span className="text-sm text-white">{'Leave game'}</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Game
                id={props.id}
                unplayedScenarios={props.unplayedScenarios}
                scenarioData={props.scenarioData}
                nextUrl={!props.disableNext ? '/play' : undefined}
            />
        </>
    );
};
