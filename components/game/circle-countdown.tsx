import { PropsWithoutRef } from 'react';

type CircleCountdownProps = {
    size: number;
    strokeWidth: number;
    percentage: number;
    label: string;
};

const CircleCountdown = (props: PropsWithoutRef<CircleCountdownProps>) => {
    const size = props.size;
    const radius = (size - props.strokeWidth) / 2;
    const viewBox = `0 0 ${size} ${size}`;
    return (
        <svg width={props.size} height={props.size} viewBox={viewBox}>
            <circle
                className="fill-primary-foreground stroke-background dark:fill-primary dark:stroke-foreground"
                cx={props.size / 2}
                cy={props.size / 2}
                r={radius}
                strokeWidth={`${props.strokeWidth}px`}
            />
            <text
                className="fill-secondary text-2xl font-bold dark:fill-foreground"
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle">
                {`${props.label}`}
            </text>
        </svg>
    );
};

export { CircleCountdown };
