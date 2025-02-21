'use client';
import { PropsWithoutRef, startTransition, useActionState, useCallback, useRef, useState } from 'react';
import { ScenarioSelect } from '~/lib/types';
import { GameNextButton } from '../game/game-next-button';
import { Game } from '../game/game';
import { useRouter } from 'next/navigation';
import { completeUserGame } from '~/lib/actions';
import posthog from 'posthog-js';
import { Scenario } from '~/lib/domain/scenario';
import { toast } from 'sonner';
import Image from 'next/image';
import { IconButton } from '../ui/icon-button';
import { GAME_MAX_SCENARIOS_IN_A_ROW } from '~/lib/constants';

type UserGameProps = {
    scenario: ScenarioSelect;
    remainingScenarios?: number;
    backstageAccess?: boolean;
    demoScenarios?: ScenarioSelect[];
    countdownRunning?: boolean;
    revealSolution?: boolean;
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
    const gameRef = useRef<{ resetGame: () => void }>(null);
    const isDemo = props.demoScenarios && props.demoScenarios?.length > 0;
    const { replace } = useRouter();

    const [nextScenarioState, completeGameAction, completionPending] = useActionState(completeUserGame, {
        scenario: props.scenario,
        pendingScenarios: props.remainingScenarios ?? 0,
        error: false
    });

    const [scenario, setScenario] = useState<ScenarioUserGame>({
        ...props.scenario,
        data: new Scenario(props.scenario.data)
    });

    const [remainingScenarios, setRemainingScenarios] = useState(
        props.remainingScenarios !== undefined ? props.remainingScenarios - 1 : undefined
    );
    const [scenariosInARow, setScenariosInARow] = useState(1);
    const [enableNext, setEnableNext] = useState(false);
    const handleGameStart = useCallback(() => {
        if (props.backstageAccess) return;

        if (!isDemo) {
            posthog.capture(posthogEvents.gameStart, {
                scenarioId: scenario.id
            });
        }
        if (isDemo) {
            posthog.capture(posthogEvents.demoStart, {
                scenarioId: scenario.id
            });
        }
    }, [scenario.id, props.backstageAccess, isDemo]);

    const handleGameFinish = useCallback(
        (success: boolean, playTime: string | null) => {
            if (props.backstageAccess) return;

            if (!isDemo) {
                startTransition(async () => {
                    completeGameAction({
                        scenarioId: scenario.id,
                        playTime: playTime,
                        success: success
                    });
                });
                posthog.capture(posthogEvents.gameFinish, {
                    scenarioId: scenario.id,
                    success
                });
            }
            if (isDemo) {
                posthog.capture(posthogEvents.demoFinish, {
                    scenarioId: scenario.id,
                    success
                });
            }

            setEnableNext(true);
        },
        [scenario.id, props.backstageAccess, completeGameAction, isDemo]
    );

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
        // When user plays N scenarios in a row, redirect to scores. Otherwise increment the counter
        if (scenariosInARow >= GAME_MAX_SCENARIOS_IN_A_ROW) {
            replace('/app/scores');
            return;
        }

        setScenariosInARow((prev) => prev + 1);
        setRemainingScenarios(pendingScenarios - 1);
        setEnableNext(false);

        if (gameRef.current) gameRef.current.resetGame();

        setScenario({
            ...nextScenario,
            data: new Scenario(nextScenario.data)
        });
    };

    const handleNextDemoScenario = () => {
        const nextScenarioIndex = remainingScenarios ? remainingScenarios - 1 : -1;
        const nextScenario = props.demoScenarios?.[nextScenarioIndex];
        if (!nextScenario) {
            replace('/login');
            return;
        }

        if (gameRef.current) gameRef.current.resetGame();
        setEnableNext(false);
        setRemainingScenarios(nextScenarioIndex);

        setScenario({
            ...nextScenario,
            data: new Scenario(nextScenario.data)
        });
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
                    {!isDemo && (
                        <div className="fixed right-60 top-7 z-10 mt-[3px] select-none font-barlow font-light text-map">
                            Remaining scenarios: {remainingScenarios}
                        </div>
                    )}
                    <GameNextButton
                        className="fixed bottom-12 right-24 z-10 px-8"
                        disabled={!enableNext}
                        loading={completionPending}
                        loadingText={'Saving...'}
                        onClick={!isDemo ? handleNextScenario : handleNextDemoScenario}>
                        {scenariosInARow >= GAME_MAX_SCENARIOS_IN_A_ROW ? 'Finish' : 'Next'}
                    </GameNextButton>
                </>
            )}
            <Game
                ref={gameRef}
                scenario={scenario}
                revealSolution={props.revealSolution}
                startGame={handleGameStart}
                endGame={handleGameFinish}
            />
        </>
    );
};

export { UserGame };
