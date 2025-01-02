import type { Flight as FromFlight } from './legacy-model.ts';
import type { Flight as IntoFlight } from './new-model.ts';

function translate(flights: FromFlight[]): IntoFlight[] {
    const res: IntoFlight[] = [];

    for (const flight of flights) {
        res.push({
            id: flight.id,
            callsign: flight.callsign,
            category: flight.acType,
            latitudeDeg: flight.points4d.synced.latDeg,
            longitudeDeg: flight.points4d.synced.lonDeg,
            groundSpeedKts: flight.gs,
            trackDeg: flight.track,
            altitudeFt: flight.points4d.synced.altFt,
            verticalSpeedFtpm: flight.verticalSpeed,
            selectedAltitudeFt: flight.selectedAlt
        });
    }

    return res;
}

export { translate };
