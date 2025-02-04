import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Duration } from 'luxon';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a seconds duration string to a fixed 2 decimal number.
 *
 * @param duration the seconds string to format (e.g. '00:00:02.382')
 * @returns formatted duration string, e.g. '2.38'
 */
export function formatDuration(duration: string) {
    return Number(Duration.fromISOTime(duration).toFormat('s.SSS')).toFixed(2);
}
