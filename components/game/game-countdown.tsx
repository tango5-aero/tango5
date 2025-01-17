'use client';

import { PropsWithoutRef } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

type GameCountdownProps = {
    initialCount: number;
    running: boolean;
    onComplete: () => void;
};

const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    return <div className="select-none text-lg text-secondary dark:text-primary">{remainingTime}</div>;
};

const GameCountdown = (props: PropsWithoutRef<GameCountdownProps>) => {
    return (
        <div className="fixed left-36 top-5 z-10 transition-all hover:scale-110">
            <CountdownCircleTimer
                isPlaying={props.running}
                duration={props.initialCount}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                size={60}
                strokeWidth={5}
                colorsTime={[30, 20, 10, 0]}
                onComplete={props.onComplete}>
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
};

export { GameCountdown };
