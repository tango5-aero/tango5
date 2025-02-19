'use client';
import { PropsWithoutRef, startTransition, useActionState, useState } from 'react';
import { ScenarioSelect } from '~/lib/types';
import { GameNextButton } from '../game/game-next-button';
import { Game } from '../game/game';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeUserGame } from '~/lib/actions';
import posthog from 'posthog-js';
import { Scenario } from '~/lib/domain/scenario';
import { toast } from 'sonner';
import Image from 'next/image';
import { IconButton } from '../ui/icon-button';

type UserGameProps = {
    scenario: ScenarioSelect;
    unplayedScenarios?: number;
    backstageAccess?: boolean;
    isDemo?: boolean;
};

export type ScenarioUserGame = {
    data: Scenario;
    id: number;
    active: boolean;
    demo: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const posthogEvents = {
    gameStart: 'game_start',
    gameFinish: 'game_finish',
    demoStart: 'demo_start',
    demoFinish: 'demo_finish'
} as const;

const UserGame = (props: PropsWithoutRef<UserGameProps>) => {
    const searchParams = useSearchParams();
    const shouldShowSolution = searchParams.get('solution') === 'true';
    const { replace } = useRouter();

    const [nextScenarioState, completeGameAction, completionPending] = useActionState(completeUserGame, {
        scenario: props.scenario,
        pendingScenarios: props.unplayedScenarios ?? 0,
        error: false
    });

    const [scenario, setScenario] = useState<ScenarioUserGame>({
        ...props.scenario,
        data: new Scenario(props.scenario.data)
    });
    const [unplayedScenarios, setUnplayedScenarios] = useState(
        props.unplayedScenarios !== undefined ? props.unplayedScenarios - 1 : undefined
    );
    const [enableNext, setEnableNext] = useState(false);

    const handleGameStart = () => {
        if (props.backstageAccess) return;

        setEnableNext(false);

        posthog.capture(posthogEvents.gameStart, {
            scenarioId: scenario.id
        });
    };

    const handleGameFinish = (success: boolean, playTime: string | null) => {
        if (props.backstageAccess) return;

        startTransition(async () => {
            completeGameAction({
                scenarioId: scenario.id,
                playTime: playTime,
                success: success
            });
        });

        setEnableNext(true);

        posthog.capture(posthogEvents.gameFinish, {
            scenarioId: scenario.id,
            success
        });
    };

    const handleNextScenario = () => {
        if (nextScenarioState.error) {
            toast.error('Something went wrong, could not load next scenario');
            replace('/app/scores');
            return;
        }

        const { scenario: nextScenario, pendingScenarios } = nextScenarioState;

        // There are no more scenarios to play, redirect to games page
        if (!nextScenario && pendingScenarios === 0) {
            replace('/app/scores');
            return;
        }

        setUnplayedScenarios(pendingScenarios - 1);

        setScenario({
            ...nextScenario,
            data: new Scenario(nextScenario.data)
        });

        setEnableNext(false);
    };

    return (
        <>
            <div className="fixed bottom-1 right-72 z-10 mt-10 text-xs text-white/15">{scenario.id}</div>
            <IconButton href={'/app/tutorial'} hoverText={'Help'}>
                <div className="border-carousel-dots button-shadow fixed right-[180px] top-6 z-10 flex w-[38px] cursor-pointer items-center justify-center rounded-full border bg-map font-barlow text-3xl text-secondary hover:bg-sidebar-foreground">
                    ?
                </div>
            </IconButton>
            <IconButton href={props.backstageAccess ? '/backstage/scenarios' : '/app/scores'} hoverText={'Options'}>
                <Image
                    src="/images/gear.svg"
                    width={27}
                    height={27}
                    alt="Options"
                    className="border-carousel-dots button-shadow fixed right-[108px] top-6 z-10 h-[38px] w-[38px] cursor-pointer rounded-full border bg-map p-1 hover:bg-sidebar-foreground"
                />
            </IconButton>
            {!props.backstageAccess && (
                <>
                    <div className="fixed right-60 top-7 z-10 mt-[3px] select-none font-barlow font-light text-map">
                        Remaining scenarios: {unplayedScenarios}
                    </div>
                    <GameNextButton
                        className="fixed bottom-12 right-24 z-10 px-8"
                        disabled={!enableNext}
                        loading={completionPending}
                        onClick={handleNextScenario}
                    />
                </>
            )}
            <Game
                scenario={scenario}
                shouldShowSolution={shouldShowSolution}
                startGame={handleGameStart}
                endGame={handleGameFinish}
            />
        </>
    );
};

export { UserGame };
