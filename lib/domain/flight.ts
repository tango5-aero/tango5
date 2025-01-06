import { destination, distance, geomReduce, getCoords, lineIntersect, lineString, point } from '@turf/turf';
import { Point } from 'geojson';

export class Flight {
    constructor(
        public readonly id: string,
        public readonly latitudeDeg: number,
        public readonly longitudeDeg: number,
        public readonly callsign?: string,
        public readonly category?: string,
        public readonly groundSpeedKts?: number,
        public readonly trackDeg?: number,
        public readonly altitudeFt?: number,
        public readonly verticalSpeedFtpm?: number,
        public readonly selectedAltitudeFt?: number
    ) {}

    /**
     * This method calculates the distance between this flight and another flight or point
     */
    public distanceToNM(other: Flight | Point, deltaTimeMs = 0) {
        const thisPositionIn = this.positionIn(deltaTimeMs);
        const otherPositionIn = other instanceof Flight ? other.positionIn(deltaTimeMs) : other;

        if (!thisPositionIn || !otherPositionIn) return;

        return distance(thisPositionIn, otherPositionIn, {
            units: 'nauticalmiles'
        });
    }

    /**
     * This method calculates the position of this flight in a given time assuming constant velocity
     */
    public positionIn(timeMs: number) {
        if (
            this.longitudeDeg === undefined ||
            this.latitudeDeg === undefined ||
            this.groundSpeedKts === undefined ||
            this.trackDeg === undefined
        )
            return;

        const distanceNM = (this.groundSpeedKts * timeMs) / 3600_000;
        const currentPoint = point([this.longitudeDeg, this.latitudeDeg]);

        return getCoords(
            destination(currentPoint, distanceNM, this.trackDeg, {
                units: 'nauticalmiles'
            })
        );
    }

    /**
     * This method calculates the trajectory of this flight between two times
     */
    public trajectory(minTimeMs: number, maxTimeMs: number) {
        const thisInMinTime = this.positionIn(minTimeMs);
        const thisInMaxTime = this.positionIn(maxTimeMs);

        if (!thisInMinTime || !thisInMaxTime) return;

        return lineString([thisInMinTime, thisInMaxTime]);
    }

    /**
     * This method calculates the crossing points between the trajectory of this flight and another flight
     */
    public crossingsWithFlight(that: Flight, minTimeMs: number, maxTimeMs: number): Point[] {
        const thisTrajectory = this.trajectory(minTimeMs, maxTimeMs);
        const thatTrajectory = that.trajectory(minTimeMs, maxTimeMs);

        if (!thatTrajectory || !thisTrajectory) return [];

        const intersections = lineIntersect(thisTrajectory, thatTrajectory);

        return geomReduce(intersections, (coords, point) => [...coords, point], [] as Point[]);
    }

    /**
     * Measure distance to another flight
     * note1: the minimum and maximum look ahead times are given by `minTimeMs` and `maxTimeMs` respectively
     */
    public measureDistanceTo(
        that: Flight,
        minTimeMs = 1_000,
        maxTimeMs = 10 * 60 * 1_000
    ):
        | { currentDistanceNM: number }
        | {
              currentDistanceNM: number;
              minimumDistanceNM: number;
              timeToMinimumDistanceMs: number;
              isFirstAtCrossing: boolean;
          }
        | undefined {
        if (0 >= minTimeMs || minTimeMs >= maxTimeMs) return;

        const currentDistanceNM = this.distanceToNM(that);

        if (currentDistanceNM === undefined) return;

        let previousDistanceNM = currentDistanceNM;

        let timeMs = minTimeMs;
        let distanceNM = this.distanceToNM(that, timeMs);

        if (distanceNM === undefined) return;

        while (previousDistanceNM > distanceNM && timeMs <= maxTimeMs) {
            previousDistanceNM = distanceNM;
            timeMs += minTimeMs;
            distanceNM = this.distanceToNM(that, timeMs);
            if (distanceNM === undefined) return;
        }

        if (timeMs > maxTimeMs) return { currentDistanceNM };

        const minimumDistanceNM = previousDistanceNM;

        if (
            minimumDistanceNM === currentDistanceNM ||
            this.groundSpeedKts === undefined ||
            that.groundSpeedKts === undefined
        )
            return { currentDistanceNM };

        const timeToMinimumDistanceMs = timeMs - minTimeMs;

        // compute where the crossings are and the minimum time it takes for both to reach any of them
        const crossings = this.crossingsWithFlight(that, minTimeMs, maxTimeMs);

        const thisMinDistanceToCrossingNM = crossings.reduce(
            (minDistanceNM, crossing) => Math.min(minDistanceNM, this.distanceToNM(crossing) ?? Infinity),
            Infinity
        );

        const thatMinDistanceToCrossingNM = crossings.reduce(
            (minDistanceNM, crossing) => Math.min(minDistanceNM, that.distanceToNM(crossing) ?? Infinity),
            Infinity
        );

        // `isFirstAtCrossing=true` means `flight` is crossing first and `this` is crossing second
        const isFirstAtCrossing =
            thatMinDistanceToCrossingNM * that.groundSpeedKts < thisMinDistanceToCrossingNM * this.groundSpeedKts;

        return {
            currentDistanceNM,
            minimumDistanceNM,
            timeToMinimumDistanceMs,
            isFirstAtCrossing
        };
    }

    get identificationDisplay() {
        const identification = this.callsign?.trim();

        let name = 'UNKNOWN';

        if (identification !== undefined && identification !== '') {
            name = identification.toLocaleUpperCase();
        }

        return name;
    }

    get intentDisplay(): '↑' | '↓' | '' {
        if (this.verticalSpeedFtpm === undefined) return '';

        if (this.verticalSpeedFtpm >= 200) return '↑';
        if (this.verticalSpeedFtpm <= -200) return '↓';

        return '';
    }

    get categoryDisplay() {
        return this.category ?? '-';
    }

    get shortSpeedDisplay() {
        return this.groundSpeedKts !== undefined ? (this.groundSpeedKts / 10).toFixed(0).padStart(2, '0') : '';
    }

    get selectedFlightLevelDisplay() {
        let selected;

        if (this.selectedAltitudeFt === undefined) {
            selected = '';
        } else {
            selected = (this.selectedAltitudeFt / 100).toFixed(0).padStart(3, '0');
        }

        return selected;
    }

    get uncorrectedFlightLevelDisplay() {
        let vertical: string;

        if (this.altitudeFt === undefined) {
            vertical = '---';
        } else {
            vertical = (this.altitudeFt / 100).toFixed(0).padStart(3, '0');
        }
        return vertical;
    }

    get label() {
        return `${this.identificationDisplay}
${this.uncorrectedFlightLevelDisplay} ${this.intentDisplay} ${this.selectedFlightLevelDisplay}
${this.shortSpeedDisplay} ${this.categoryDisplay}`;
    }
}