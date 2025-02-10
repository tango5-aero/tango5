'use client';

import { PropsWithoutRef } from 'react';
import { CircleCountdown } from '~/components/ui/circle-countdown';
import { GAME_INDICATOR_SIZE, GAME_INDICATOR_TRAIL_STROKE_WIDTH } from '~/lib/constants';
import { cn } from '~/lib/utils';

type GameProgressProps = {
    progress: number;
    total: number;
    className?: string;
};

const GameProgress = (props: PropsWithoutRef<GameProgressProps>) => {
    return (
        <div className={cn('select-none text-lg', props.className)}>
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
