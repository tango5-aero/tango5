'use client';

import { PropsWithoutRef, useState } from 'react';
import { ScenarioSelect } from '~/lib/types';
import { GameInitialCountdown } from '~/components/game/game-initial-countdown';
import { Game } from '~/components/game/game';

type GameLayoutProps = {
    scenario: ScenarioSelect;
    showSolution?: boolean;
    backstageAccess?: boolean;
    remainingScenarios?: number;
};

const GameComponent = (props: PropsWithoutRef<GameLayoutProps & { countdownRunning: boolean }>) => {
    return (
        <Game
            scenario={props.scenario}
            showSolution={props.showSolution}
            countdownRunning={props.countdownRunning}
            backstageAccess={props.backstageAccess}
            unplayedScenarios={props.remainingScenarios}
        />
    );
};

export const GameLayout = (props: PropsWithoutRef<GameLayoutProps>) => {
    const [countdownRunning, setCountdownRunning] = useState(!props.showSolution);

    if (!props.showSolution) {
        return (
            <GameInitialCountdown running={countdownRunning} onComplete={() => setCountdownRunning(false)}>
                <GameComponent countdownRunning={countdownRunning} {...props} />
            </GameInitialCountdown>
        );
    }

    return <GameComponent countdownRunning={countdownRunning} {...props} />;
};
