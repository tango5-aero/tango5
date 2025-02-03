import { PropsWithoutRef, ComponentType } from 'react';
import { LucideProps, CircleCheck, XCircle, Clock3 } from 'lucide-react';
import { getCurrentUserGamesPerformance } from '~/lib/actions';
import { Duration } from 'luxon';

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

    if (!performance) {
        return null;
    }

    const { succeeded, playTimeAvg } = performance;

    const average = playTimeAvg ? Duration.fromISOTime(playTimeAvg).toFormat('s') : '-';

    return (
        <section className="flex items-center justify-center gap-x-5">
            <GamePerformanceStat
                icon={succeeded > 0 ? CircleCheck : XCircle}
                stat={`${succeeded}/${performance.total}`}
                description="scenarios completed"
            />
            <GamePerformanceStat icon={Clock3} stat={`${average}`} description="seconds on average" />
        </section>
    );
}
