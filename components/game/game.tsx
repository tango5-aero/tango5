'use client';

import { PropsWithoutRef, useEffect, useMemo, useRef, useState } from 'react';
import { ScenarioMap } from '~/components/scenario/scenario-map';
import { Scenario } from '~/lib/domain/scenario';
import { Scenario as ScenarioData } from '~/lib/domain/validators';
import { Button } from '~/components/ui/button';
import { redirect } from 'next/navigation';
import { completeUserGame } from '~/lib/actions';
import { GameCountdown } from './game-countdown';
import posthog from 'posthog-js';
import { GameProgress } from './game-progress';
import { GAME_TIMEOUT_MS } from '~/lib/constants';

const posthogEvents = {
    gameStart: 'game_start',
    gameFinish: 'game_finish'
};

const Game = (props: PropsWithoutRef<{ id: number; scenario: ScenarioData; nextUrl: string }>) => {
    const scenario = useMemo(() => new Scenario(props.scenario), [props.scenario]);

    // Game related state
    const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
    const [selectedPairs, setSelectedPairs] = useState<[string, string][]>([]);
    const [isGameOver, setGameOver] = useState(false);

    const gameStartTimeMs = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (typeof gameStartTimeMs.current === 'undefined') {
            gameStartTimeMs.current = performance.now();

            posthog.capture(posthogEvents.gameStart, {
                scenarioId: props.id
            });
        }
    }, [props.id]);

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

    const selectFlight = (id: string) => {
        // if the game is over do not allow further interactions
        if (isGameOver) {
            return;
        }

        const flight = props.scenario.flights.find((flight) => flight.id === id);

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
            <div className="fixed bottom-12 right-24 z-10">
                <Button disabled={!isGameOver} onClick={() => redirect(props.nextUrl)} variant="map" size="map">
                    {'NEXT'}
                </Button>
            </div>
            <GameProgress total={scenario.solution.length} progress={scenario.numberCorrect(selectedPairs)} />
            <GameCountdown
                initialCount={GAME_TIMEOUT_MS / 1000}
                running={!isGameOver}
                onComplete={() => setGameOver(true)}
            />
            <ScenarioMap
                style={{ width: '100%', height: '100dvh' }}
                scenario={scenario}
                selectFlight={selectFlight}
                selectedFlight={selectedFlight}
                selectedPairs={selectedPairs}
                isGameOver={isGameOver}
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
