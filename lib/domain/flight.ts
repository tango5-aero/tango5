import { destination, distance, getCoords, point } from '@turf/turf';
import { Point } from 'geojson';

export class Flight {
    constructor(
        public readonly id: string,
        public readonly latitudeDeg: number,
        public readonly longitudeDeg: number,
        public readonly altitudeFt: number,
        public readonly callsign: string,
        public readonly groundSpeedKts: number,
        public readonly trackDeg: number,
        public readonly verticalSpeedFtpm: number,
        public readonly selectedAltitudeFt: number
    ) {}

    /**
     * This method calculates the distance between this flight and another flight or point
     */
    public distanceToNM(other: Flight | Point, deltaTimeMs = 0) {
        const thisPositionIn = this.positionIn(deltaTimeMs);
        const otherPositionIn = other instanceof Flight ? other.positionIn(deltaTimeMs) : other;

        return distance(thisPositionIn, otherPositionIn, {
            units: 'nauticalmiles'
        });
    }

    /**
     * This method calculates the position of this flight in a given time assuming constant velocity
     */
    public positionIn(timeMs: number) {
        const distanceNM = (this.groundSpeedKts * timeMs) / 3600_000;
        const currentPoint = point([this.longitudeDeg, this.latitudeDeg]);

        return getCoords(
            destination(currentPoint, distanceNM, this.trackDeg, {
                units: 'nauticalmiles'
            })
        );
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
        if (this.selectedAltitudeFt === undefined || this.altitudeFt === undefined) return '';

        const altitudeFtWithoutDecimals = Math.round(this.altitudeFt / 100);
        const selectedAltitudeFtWithoutDecimals = Math.round(this.selectedAltitudeFt / 100);
        if (selectedAltitudeFtWithoutDecimals > altitudeFtWithoutDecimals) return '↑';
        if (selectedAltitudeFtWithoutDecimals < altitudeFtWithoutDecimals) return '↓';

        return '';
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
${this.shortSpeedDisplay}`;
    }
}
