import { Flight } from './flight';

export class Pcd {
    private conflict_distance_threshold_nm = 5;
    private monitor_distance_threshold_nm = 9;

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
        return this.minDistanceNM <= this.conflict_distance_threshold_nm;
    }

    get isMonitor() {
        return this.minDistanceNM <= this.monitor_distance_threshold_nm;
    }

    get isSafe() {
        return !this.isMonitor;
    }
}

function formatMs(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = (millis % 60000) / 1000;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
}
