'use client';

import { PropsWithoutRef, useState } from 'react';
import { ScenarioSelect } from '~/lib/types';
import { GameInitialCountdown } from '~/components/game/game-initial-countdown';
import { Game } from '~/components/game/game';

type GameLayoutProps = {
    scenario: ScenarioSelect;
    revealSolution?: boolean;
    backstageAccess?: boolean;
    remainingScenarios?: number;
};

export const GameLayout = (props: PropsWithoutRef<GameLayoutProps>) => {
    const [countdownRunning, setCountdownRunning] = useState(!props.revealSolution);

    if (!props.revealSolution) {
        return (
            <GameInitialCountdown running={countdownRunning} onComplete={() => setCountdownRunning(false)}>
                <Game countdownRunning={countdownRunning} {...props} />
            </GameInitialCountdown>
        );
    }

    return <Game countdownRunning={countdownRunning} {...props} />;
};
