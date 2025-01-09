'use client';

import { useEffect, useRef, useState } from 'react';
import { GameFinishDialog } from './game-finish-dialog';
import { ScenarioMap } from '../scenario/scenario-map';
import { Scenario } from '~/lib/domain/scenario';
import { toast } from 'sonner';

const TIME_TO_FINISH_GAME = 5000;

const Game = ({ scenario }: { scenario: Scenario }) => {
    const [isFinish, setIsFinish] = useState(false);
    const [selectedPairs, setSelectedPairs] = useState<[string, string][]>([]);
    const [score, setScore] = useState(0);

    const firstRenderTime = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (typeof firstRenderTime.current === 'undefined') {
            firstRenderTime.current = performance.now();
        }
        setTimeout(() => {
            setIsFinish(true);
        }, TIME_TO_FINISH_GAME);
    }, []);

    useEffect(() => {
        const correct = selectedPairs.filter(
            (pair) =>
                scenario.pcds.filter(
                    (pcd) =>
                        (pcd.firstId === pair[0] && pcd.secondId === pair[1]) ||
                        (pcd.firstId === pair[1] && pcd.secondId === pair[0])
                ).length !== 0
        );

        const elapsed = firstRenderTime.current ? performance.now() - firstRenderTime.current : 0;

        if (Math.floor(elapsed / 1000) > 0) {
            toast(
                `Guessed ${correct.length} (out of ${scenario.pcds.length}) in ${selectedPairs.length} attempt${selectedPairs.length === 1 ? '' : 's'} in ${formatMs(elapsed)}`
            );
        }
    }, [scenario.pcds, selectedPairs]);

    const handleSelectPair = (pair: [string, string]) => {
        const prevPair = selectedPairs.find(
            (selectedPair) =>
                (selectedPair[0] === pair[0] && selectedPair[1] === pair[1]) ||
                (selectedPair[0] === pair[1] && selectedPair[1] === pair[0])
        );

        if (!prevPair) {
            setSelectedPairs([...selectedPairs, pair]);
            setScore(score + 1);
        }
    };

    return (
        <>
            <GameFinishDialog open={isFinish} score={score} />
            <ScenarioMap
                style={{ width: '100%', height: '100dvh' }}
                scenario={scenario}
                onSelectPair={handleSelectPair}
                selectedPairs={selectedPairs}
            />
        </>
    );
};

export function formatMs(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = (millis % 60000) / 1000;
    return (minutes > 0 ? minutes.toFixed(0) + 'm ' : '') + seconds.toFixed(0) + 's';
}
export { Game };
