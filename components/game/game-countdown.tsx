'use client';

import { PropsWithoutRef } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { GAME_INDICATOR_SIZE, GAME_INDICATOR_STROKE_WIDTH, GAME_INDICATOR_TRAIL_STROKE_WIDTH } from '~/lib/constants';
import { cn } from '~/lib/utils';

type GameCountdownProps = {
    initialCount: number;
    running: boolean;
    className?: string;
    onComplete: () => void;
};

const FULL_SIZE = GAME_INDICATOR_SIZE + GAME_INDICATOR_STROKE_WIDTH - GAME_INDICATOR_TRAIL_STROKE_WIDTH;
const BG_SIZE = GAME_INDICATOR_SIZE - GAME_INDICATOR_TRAIL_STROKE_WIDTH;
const COUNTDOWN_COLOR = '#fff';

const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    return <div className="select-none text-2xl font-bold text-secondary dark:text-foreground">{remainingTime}</div>;
};

const GameCountdown = (props: PropsWithoutRef<GameCountdownProps>) => {
    return (
        <div className={cn('flex items-center justify-center', props.className)}>
            <div
                className={`fixed rounded-full bg-primary-foreground dark:bg-primary`}
                style={{ width: `${BG_SIZE}px`, height: `${BG_SIZE}px` }}></div>
            <CountdownCircleTimer
                isPlaying={props.running}
                duration={props.initialCount}
                colors={COUNTDOWN_COLOR}
                trailColor={COUNTDOWN_COLOR}
                size={FULL_SIZE}
                strokeWidth={GAME_INDICATOR_STROKE_WIDTH}
                trailStrokeWidth={GAME_INDICATOR_TRAIL_STROKE_WIDTH}
                onComplete={props.onComplete}>
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
};

export { GameCountdown };
