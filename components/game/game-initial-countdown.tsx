'use client';

import { PropsWithChildren, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { cn } from '~/lib/utils';
import { GAME_COUNTDOWN_DURATION } from '~/lib/constants';

const COUNTDOWN_COLOR = '#fff';

type GameInitialCountdownProps = {
    running: boolean;
    onComplete: () => void;
};

const Time = ({ value: remainingTime }: { value: number }) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef<number | null>(null);
    const isNewTimeFirstTick = useRef(false);
    const [, setOneLastRerender] = useState(0);

    if (currentTime.current !== remainingTime) {
        isNewTimeFirstTick.current = true;
        prevTime.current = currentTime.current;
        currentTime.current = remainingTime;
    } else {
        isNewTimeFirstTick.current = false;
    }

    // force one last re-render when the time is over to tirgger the last animation
    if (remainingTime === 0) {
        setTimeout(() => {
            setOneLastRerender((val) => val + 1);
        }, 20);
    }

    const isTimeUp = isNewTimeFirstTick.current;

    return (
        <div className="relative font-barlow text-6xl text-white">
            <div
                key={remainingTime}
                className={cn(
                    'absolute left-0 top-0 flex h-full w-full translate-y-0 items-center justify-center opacity-100 transition-all duration-300',
                    isTimeUp && 'scale-0 opacity-0'
                )}>
                {remainingTime}
            </div>
            {prevTime.current !== null && (
                <div
                    key={prevTime.current}
                    className={cn(
                        'absolute left-0 top-0 flex h-full w-full translate-y-0 items-center justify-center opacity-100 transition-all duration-300',
                        !isTimeUp && 'scale-[3] opacity-0'
                    )}>
                    {prevTime.current}
                </div>
            )}
        </div>
    );
};

export const GameInitialCountdown = (props: PropsWithChildren<GameInitialCountdownProps>) => {
    return (
        <div className="relative">
            <div className={cn(props.running && 'blur-md')}>{props.children}</div>
            {props.running && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <CountdownCircleTimer
                        isPlaying
                        duration={GAME_COUNTDOWN_DURATION}
                        colors={COUNTDOWN_COLOR}
                        trailColor={COUNTDOWN_COLOR}
                        strokeWidth={0}
                        trailStrokeWidth={0}
                        onComplete={props.onComplete}>
                        {({ remainingTime }) => <Time value={remainingTime} />}
                    </CountdownCircleTimer>
                </div>
            )}
        </div>
    );
};
