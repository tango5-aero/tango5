'use client';

import { PropsWithChildren } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { cn } from '~/lib/utils';
import { GAME_COUNTDOWN_DURATION } from '~/lib/constants';

const COUNTDOWN_COLOR = '#fff';

type GameInitialCountdownProps = {
    running: boolean;
    onComplete: () => void;
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
                        {({ remainingTime }) => <div className="font-barlow text-6xl text-white">{remainingTime}</div>}
                    </CountdownCircleTimer>
                </div>
            )}
        </div>
    );
};
