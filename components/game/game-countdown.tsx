'use client';

import { PropsWithoutRef } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

type GameCountdownProps = {
    initialCount: number;
    running: boolean;
    onComplete: () => void;
};

const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    return <div className="select-none text-2xl font-bold text-secondary dark:text-foreground">{remainingTime}</div>;
};

const GameCountdown = (props: PropsWithoutRef<GameCountdownProps>) => {
    return (
        <div className="fixed left-36 top-5 z-10 flex items-center justify-center transition-all hover:scale-110">
            <div className="fixed size-[58px] rounded-full bg-primary-foreground dark:bg-primary"></div>
            <CountdownCircleTimer
                isPlaying={props.running}
                duration={props.initialCount}
                colors="#fff"
                trailColor="#fff"
                size={64}
                strokeWidth={6}
                trailStrokeWidth={2}
                onComplete={props.onComplete}>
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
};

export { GameCountdown };
