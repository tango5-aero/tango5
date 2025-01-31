'use client';

import posthog from 'posthog-js';
import { PropsWithoutRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { completeUserGame } from '~/lib/actions';
import { GAME_TIMEOUT_MS, TIME_TO_REMOVE_FAILED_PAIRS_MS } from '~/lib/constants';
import { Pcd } from '~/lib/domain/pcd';
import { Scenario, ScenarioData } from '~/lib/domain/scenario';
import { LinkButton } from '~/components/ui/link-button';
import { GameCountdown } from '~/components/game/game-countdown';
import { GameProgress } from '~/components/game/game-progress';
import { ScenarioMap } from '~/components/scenario/scenario-map';

const posthogEvents = {
    gameStart: 'game_start',
    gameFinish: 'game_finish'
};

const Game = (
    props: PropsWithoutRef<{
        id: number;
        unplayedScenarios: number;
        scenarioData: ScenarioData;
        nextUrl: string;
    }>
) => {
    const scenario = useMemo(() => new Scenario(props.scenarioData), [props.scenarioData]);

    // Game related state
    const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
    const [selectedPairs, setSelectedPairs] = useState<[string, string][]>([]);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isGameOver, setGameOver] = useState(false);
    const selectedPairsRef = useRef(selectedPairs);

    const gameStartTimeMs = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (isMapReady && typeof gameStartTimeMs.current === 'undefined') {
            gameStartTimeMs.current = performance.now();

            posthog.capture(posthogEvents.gameStart, {
                scenarioId: props.id
            });
        }
    }, [props.id, isMapReady]);

    useEffect(() => {
        if (isGameOver) {
            const elapsed = gameStartTimeMs.current ? performance.now() - gameStartTimeMs.current : 0;
            const gameSuccess = scenario.isSolution(selectedPairs);

            completeUserGame(props.id, elapsed, gameSuccess);

            posthog.capture(posthogEvents.gameFinish, {
                scenarioId: props.id,
                playTime: elapsed,
                success: gameSuccess
            });
        }
    }, [scenario, isGameOver, props.id, selectedPairs]);

    useEffect(() => {
        if (scenario.isSolution(selectedPairs)) {
            setGameOver(true);
        }
    }, [scenario, selectedPairs]);

    const isClear = useCallback(
        (pair: [string, string]) => {
            const pcd = scenario.pcds.find(
                (pcd) =>
                    (pcd.firstFlight.id === pair[0] && pcd.secondFlight.id === pair[1]) ||
                    (pcd.firstFlight.id === pair[1] && pcd.secondFlight.id === pair[0])
            );
            return (
                typeof pcd === 'undefined' ||
                new Pcd(pcd.firstFlight, pcd.secondFlight, pcd.minDistanceNM, pcd.timeToMinDistanceMs).isSafe
            );
        },
        [scenario.pcds]
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

    const selectFlight = (id: string) => {
        // if the game is over do not allow further interactions
        if (isGameOver) {
            return;
        }

        const flight = props.scenarioData.flights.find((flight) => flight.id === id);

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
            <LinkButton
                href={props.nextUrl}
                variant="map"
                size="map"
                disabled={!isGameOver}
                className="fixed bottom-12 right-24 z-10">
                {'NEXT'}
            </LinkButton>
            <div className="fixed bottom-1 right-72 z-10 mt-10 text-xs text-white/15">{props.id}</div>
            {isMapReady && (
                <>
                    <GameProgress total={scenario.solution.length} progress={scenario.numberCorrect(selectedPairs)} />
                    <GameCountdown
                        initialCount={GAME_TIMEOUT_MS / 1000}
                        running={!isGameOver}
                        onComplete={() => setGameOver(true)}
                    />
                    <div className="fixed right-32 top-6 z-10 select-none text-white/50">
                        Remaining scenarios: {props.unplayedScenarios}
                    </div>
                </>
            )}
            <ScenarioMap
                style={{ width: '100%', height: '100dvh' }}
                scenario={scenario}
                selectFlight={selectFlight}
                selectedFlight={selectedFlight}
                selectedPairs={selectedPairs}
                isGameOver={isGameOver}
                onMapReady={() => setIsMapReady(true)}
            />
        </main>
    );
};

export function formatMs(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = (millis % 60000) / 1000;
    return (minutes > 0 ? minutes.toFixed(0) + 'm ' : '') + seconds.toFixed(0) + 's';
}
export { Game };
