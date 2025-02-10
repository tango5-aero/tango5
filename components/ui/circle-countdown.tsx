import { PropsWithoutRef } from 'react';

type CircleCountdownProps = {
    size: number;
    strokeWidth: number;
    label: string;
};

const CircleCountdown = (props: PropsWithoutRef<CircleCountdownProps>) => {
    const size = props.size;
    const radius = (size - props.strokeWidth) / 2;
    const viewBox = `0 0 ${size} ${size}`;
    return (
        <svg width={props.size} height={props.size} viewBox={viewBox}>
            <circle
                className="fill-primary stroke-current"
                cx={props.size / 2}
                cy={props.size / 2}
                r={radius}
                strokeWidth={`${props.strokeWidth}px`}
            />
            <text className="fill-current text-2xl font-bold" x="50%" y="50%" dy=".3em" textAnchor="middle">
                {`${props.label}`}
            </text>
        </svg>
    );
};

export { CircleCountdown };
