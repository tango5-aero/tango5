'use client';

import { PropsWithoutRef } from 'react';
import { CircleCountdown } from './circle-countdown';
import { GAME_INDICATOR_SIZE, GAME_INDICATOR_TRAIL_STROKE_WIDTH } from '~/lib/constants';

type GameProgressProps = {
    progress: number;
    total: number;
};

const GameProgress = (props: PropsWithoutRef<GameProgressProps>) => {
    return (
        <div className="fixed left-16 top-5 z-10 select-none text-lg text-secondary transition-all hover:scale-110 dark:text-primary">
            <CircularProgressWithLabel progress={props.progress} total={props.total} />
        </div>
    );
};

function CircularProgressWithLabel(props: GameProgressProps) {
    return (
        <CircleCountdown
            size={GAME_INDICATOR_SIZE}
            strokeWidth={GAME_INDICATOR_TRAIL_STROKE_WIDTH}
            label={`${props.progress}/${props.total}`}
        />
    );
}

export { GameProgress };
