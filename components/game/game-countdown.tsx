'use client';

import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { GAME_TIMEOUT_MS as initialCount } from './game';

const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    return <div className="select-none text-lg text-secondary dark:text-primary">{remainingTime}</div>;
};

const GameCountdown = ({ running, onComplete }: { running: boolean; onComplete: () => void }) => {
    return (
        <div className="fixed left-6 top-5 z-10 transition-all hover:scale-110">
            <CountdownCircleTimer
                isPlaying={running}
                duration={initialCount / 1000}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                size={60}
                strokeWidth={5}
                colorsTime={[30, 20, 10, 0]}
                onComplete={onComplete}>
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
};

export { GameCountdown };
