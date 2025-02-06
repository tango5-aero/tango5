import { CircleCheck, Clock3, LucideProps, XCircle } from 'lucide-react';
import { ComponentType, PropsWithoutRef } from 'react';
import { getCurrentUserGamesPerformance } from '~/lib/actions';
import { formatDuration } from '~/lib/utils';

const GamePerformanceStat = (
    props: PropsWithoutRef<{ icon: ComponentType<LucideProps>; stat: string; description: string }>
) => {
    const Icon = props.icon;

    return (
        <article className="flex flex-col gap-2 rounded-lg border border-gray-300/80 p-4 hover:border-gray-400">
            <div className="flex items-end justify-center gap-2">
                <Icon size={28} />
                <span className="select-none text-lg font-semibold">{props.stat}</span>
            </div>
            <span className="w-full select-none text-center font-mono text-sm">{props.description}</span>
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
        <section className="flex items-center justify-center gap-x-5">
            <GamePerformanceStat
                icon={succeeded > 0 ? CircleCheck : XCircle}
                stat={`${succeeded}/${total}`}
                description="resolved scenarios"
            />
            <GamePerformanceStat icon={Clock3} stat={computedAverage} description="seconds on average" />
        </section>
    );
}
