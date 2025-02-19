'use client';

import { PropsWithoutRef, useCallback, useEffect, useRef, useState } from 'react';
import { Duration } from 'luxon';
import { GAME_TIMEOUT_MS, TIME_TO_REMOVE_FAILED_PAIRS_MS } from '~/lib/constants';
import { Pcd } from '~/lib/domain/pcd';
import { GameCountdown } from '~/components/game/game-countdown';
import { GameProgress } from '~/components/game/game-progress';
import { ScenarioMap } from '~/components/scenario/scenario-map';
import { ScenarioUserGame } from '../usergame/usergame';

type GameProps = {
    scenario: ScenarioUserGame;
    shouldShowSolution?: boolean;
    startGame: () => void;
    endGame: (success: boolean, playTime: string | null) => void;
};

const Game = (props: PropsWithoutRef<GameProps>) => {
    const { scenario, shouldShowSolution } = props;
    // Game related state
    const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
    const [selectedPairs, setSelectedPairs] = useState<[string, string][]>([]);
    const [isMapReady, setIsMapReady] = useState(false);
    const [gameSuccess, setGameSuccess] = useState<boolean | null>(null); // true if game is won, false if lost, null if not finished
    const selectedPairsRef = useRef(selectedPairs);

    const gameStartTimeMs = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (isMapReady && typeof gameStartTimeMs.current === 'undefined') {
            gameStartTimeMs.current = performance.now();
            props.startGame();
        }
    }, [scenario.id, isMapReady]);

    useEffect(() => {
        if (gameSuccess === null) return;

        const elapsed = gameStartTimeMs.current ? performance.now() - gameStartTimeMs.current : 0;
        const playTime = gameSuccess ? Duration.fromMillis(elapsed).toString() : null;

        props.endGame(gameSuccess, playTime);
    }, [scenario, gameSuccess]);

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
