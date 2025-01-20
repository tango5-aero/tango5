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
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * props.percentage) / 100;
    return (
        <svg width={props.size} height={props.size} viewBox={viewBox}>
            <circle
                className="fill-none stroke-primary dark:stroke-secondary"
                cx={props.size / 2}
                cy={props.size / 2}
                r={radius}
                strokeWidth={`${props.strokeWidth}px`}
            />
            <circle
                className="fill-none stroke-secondary dark:stroke-primary"
                cx={props.size / 2}
                cy={props.size / 2}
                r={radius}
                strokeWidth={`${props.strokeWidth}px`}
                transform={`rotate(-90 ${props.size / 2} ${props.size / 2})`}
                style={{
                    strokeDasharray: dashArray,
                    strokeDashoffset: dashOffset
                }}
            />
            <text className="fill-secondary dark:fill-primary" x="50%" y="50%" dy=".3em" textAnchor="middle">
                {`${props.label}`}
            </text>
        </svg>
    );
};

export { CircleCountdown };
