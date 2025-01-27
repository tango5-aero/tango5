import { CONFLICT_DISTANCE_THRESHOLD_NM, MONITOR_DISTANCE_THRESHOLD_NM } from '../constants';
import { Flight } from './flight';

export class Pcd {
    constructor(
        public readonly firstFlight: Flight,
        public readonly secondFlight: Flight,
        public readonly minDistanceNM: number,
        public readonly timeToMinDistanceMs: number
    ) {}

    get description() {
        return `${this.minDistanceNM.toFixed(1)}NM ${formatMs(this.timeToMinDistanceMs)}`;
    }

    get isConflict() {
        return this.minDistanceNM <= CONFLICT_DISTANCE_THRESHOLD_NM;
    }

    get isMonitor() {
        return !this.isConflict && this.minDistanceNM <= MONITOR_DISTANCE_THRESHOLD_NM;
    }

    get isSafe() {
        return !this.isMonitor && !this.isConflict;
    }
}

function formatMs(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = (millis % 60000) / 1000;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
}
