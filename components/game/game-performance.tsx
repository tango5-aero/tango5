import { PropsWithoutRef } from 'react';
import { getCurrentUserGamesPerformance } from '~/lib/actions';
import { formatDuration } from '~/lib/utils';

const GamePerformanceStat = (props: PropsWithoutRef<{ stat: string; description: string }>) => {
    return (
        <article className="flex max-w-[380px] select-none items-center gap-3 rounded-full bg-navbarBG py-5 pl-8 pr-4 hover:brightness-125">
            <div className="font-barlow text-[70px] leading-none">{props.stat}</div>
            <div className="max-w-fit text-balance font-barlow text-3xl font-light uppercase leading-7 text-[#A4B2B4]">
                {props.description}
            </div>
        </article>
    );
};

export async function GamePerformance() {
    const performance = await getCurrentUserGamesPerformance();

    if (!performance || performance.total === 0) {
        return null;
    }

    const { succeeded, total, playTimeAvg } = performance;

    const computedAverage = playTimeAvg ? formatDuration(playTimeAvg) : '-';

    return (
        <section className="flex items-center justify-center gap-x-10">
            <GamePerformanceStat stat={`${succeeded}/${total}`} description="successful scenarios" />
            <GamePerformanceStat stat={computedAverage} description="seconds on average" />
        </section>
    );
}
