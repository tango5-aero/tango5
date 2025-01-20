'use client';

import { PropsWithoutRef } from 'react';
import { CircleCountdown } from './circle-countdown';

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
    return <CircleCountdown size={60} strokeWidth={2} label={`${props.progress}/${props.total}`} />;
}

export { GameProgress };
