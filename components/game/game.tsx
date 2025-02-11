'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PropsWithoutRef, startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import posthog from 'posthog-js';
import { Duration } from 'luxon';
import { completeUserGame } from '~/lib/actions';
import { GAME_TIMEOUT_MS, TIME_TO_REMOVE_FAILED_PAIRS_MS } from '~/lib/constants';
import { Pcd } from '~/lib/domain/pcd';
import { Scenario } from '~/lib/domain/scenario';
import { ScenarioParsed } from '~/lib/types';
import { GameCountdown } from '~/components/game/game-countdown';
import { IconButton } from '~/components/ui/icon-button';
import { GameNextButton } from '~/components/game/game-next-button';
import { GameProgress } from '~/components/game/game-progress';
import { ScenarioMap } from '~/components/scenario/scenario-map';
import Image from 'next/image';

type GameProps = {
    scenario: ScenarioParsed;
    unplayedScenarios?: number;
    backstageAccess?: boolean;
};

const posthogEvents = {
    gameStart: 'game_start',
    gameFinish: 'game_finish'
};

const Game = (props: PropsWithoutRef<GameProps>) => {
    const searchParams = useSearchParams();
    const shouldShowSolution = searchParams.get('solution') === 'true';
    const { replace } = useRouter();
    const [scenario, setScenario] = useState({
        ...props.scenario,
        data: new Scenario(props.scenario.data)
    });
    const [unplayedScenarios, setUnplayedScenarios] = useState(
        props.unplayedScenarios !== undefined ? props.unplayedScenarios - 1 : undefined
    );

    // Game related state
    const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
    const [selectedPairs, setSelectedPairs] = useState<[string, string][]>([]);
    const [isMapReady, setIsMapReady] = useState(false);
    const [gameSuccess, setGameSuccess] = useState<boolean | null>(null); // true if game is won, false if lost, null if not finished
    const selectedPairsRef = useRef(selectedPairs);

    const [nextScenarioState, completeGameAction, completionPending] = useActionState(completeUserGame, {
        scenario: props.scenario,
        pendingScenarios: props.unplayedScenarios ?? 0,
        error: false
    });

    const gameStartTimeMs = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (isMapReady && typeof gameStartTimeMs.current === 'undefined') {
            gameStartTimeMs.current = performance.now();

            if (props.backstageAccess) return;

            posthog.capture(posthogEvents.gameStart, {
                scenarioId: scenario.id
            });
        }
    }, [scenario.id, isMapReady, props.backstageAccess]);

    useEffect(() => {
        if (gameSuccess === null) return;
        if (props.backstageAccess) return;

        const elapsed = gameStartTimeMs.current ? performance.now() - gameStartTimeMs.current : 0;

        startTransition(async () => {
            completeGameAction({
                scenarioId: scenario.id,
                playTime: Duration.fromMillis(elapsed).toString(),
                success: gameSuccess
            });
        });

        posthog.capture(posthogEvents.gameFinish, {
            scenarioId: scenario.id,
            playTime: elapsed,
            success: gameSuccess
        });
    }, [scenario, gameSuccess, completeGameAction, props.backstageAccess]);

    useEffect(() => {
        if (scenario.data.isSolution(selectedPairs) || shouldShowSolution) {
            setGameSuccess(true);
        }
    }, [scenario, selectedPairs, shouldShowSolution]);

    const isClear = useCallback(
        (pair: [string, string]) => {
            const pcd = scenario.data.pcds.find(
                (pcd) =>
                    (pcd.firstFlight.id === pair[0] && pcd.secondFlight.id === pair[1]) ||
                    (pcd.firstFlight.id === pair[1] && pcd.secondFlight.id === pair[0])
            );
            return (
                typeof pcd === 'undefined' ||
                new Pcd(pcd.firstFlight, pcd.secondFlight, pcd.minDistanceNM, pcd.timeToMinDistanceMs).isSafe
            );
        },
        [scenario.data.pcds]
    );

    useEffect(() => {
        selectedPairsRef.current = selectedPairs;
        const pairsToClean = selectedPairs.filter((pair) => isClear(pair));
        if (pairsToClean.length > 0) {
            setTimeout(() => {
                setSelectedPairs(selectedPairsRef.current.filter((pair) => !pairsToClean.includes(pair)));
            }, TIME_TO_REMOVE_FAILED_PAIRS_MS);
        }
    }, [selectedPairs, isClear]);

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

        // Preparing next scenario, reset timer and game state
        gameStartTimeMs.current = undefined;

        setSelectedFlight(null);
        setSelectedPairs([]);
        setIsMapReady(false);
        setGameSuccess(null);
        setUnplayedScenarios(pendingScenarios - 1);

        setScenario({
            ...nextScenario,
            data: new Scenario(nextScenario.data)
        });
    };

    const selectFlight = (id: string) => {
        // if the game is over do not allow further interactions
        if (gameSuccess !== null) {
            return;
        }

        const flight = scenario.data.flights.find((flight) => flight.id === id);

        // this should never happen, fail silently
        if (!flight) return;

        // if there is no previous selection, just select current flight
        if (!selectedFlight) {
            setSelectedFlight(flight.id);
            return;
        }

        // deselect the flight if it was already selected
        if (selectedFlight === flight.id) {
            setSelectedFlight(null);
            return;
        }

        const pair = [selectedFlight, flight.id] as [string, string];

        // ignore the pair if it was already selected
        const alreadySelected = selectedPairs.find(
            (selectedPair) =>
                (selectedPair[0] === pair[0] && selectedPair[1] === pair[1]) ||
                (selectedPair[0] === pair[1] && selectedPair[1] === pair[0])
        );
        if (alreadySelected) {
            return;
        }

        // update user selection pairs and clear current flight selection
        setSelectedPairs([...selectedPairs, pair]);
        setSelectedFlight(null);
    };

    return (
        <main>
            <div className="fixed bottom-1 right-72 z-10 mt-10 text-xs text-white/15">{scenario.id}</div>

            <IconButton href={'/app/tutorial'} hoverText={'Help'}>
                <Image
                    src="/images/question.svg"
                    width={27}
                    height={27}
                    alt="Help"
                    className="border-carousel-dots button-shadow fixed right-[180px] top-6 z-10 h-[38px] w-[38px] cursor-pointer rounded-full border bg-map p-1 hover:bg-sidebar-foreground"
                />
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
                        className="fixed bottom-12 right-24 z-10"
                        disabled={gameSuccess === null}
                        loading={completionPending}
                        onClick={handleNextScenario}
                    />
                </>
            )}

            {isMapReady && (
                <>
                    <GameProgress
                        className="fixed left-16 top-5 z-10 transition-all hover:scale-110"
                        total={scenario.data.solution.length}
                        progress={scenario.data.numberCorrect(selectedPairs)}
                    />
                    <GameCountdown
                        className="fixed left-36 top-5 z-10 transition-all hover:scale-110"
                        initialCount={GAME_TIMEOUT_MS / 1000}
                        running={gameSuccess === null}
                        onComplete={() => setGameSuccess(false)}
                    />
                </>
            )}

            <ScenarioMap
                style={{ width: '100%', height: '100dvh' }}
                scenario={scenario.data}
                selectFlight={selectFlight}
                selectedFlight={selectedFlight}
                selectedPairs={selectedPairs}
                isGameOver={gameSuccess !== null}
                onMapReady={() => setIsMapReady(true)}
            />
        </main>
    );
};

export { Game };
