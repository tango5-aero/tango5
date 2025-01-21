import { Flight } from './flight';
import { Pcd } from './pcd';
import { Scenario as ScenarioDTO } from './validators';

export class Scenario {
    flights: Flight[];
    pcds: Pcd[];
    target: number;

    constructor(scenario: ScenarioDTO) {
        this.flights = scenario.flights.map(
            (flight) =>
                new Flight(
                    flight.id,
                    flight.latitudeDeg,
                    flight.longitudeDeg,
                    flight.altitudeFt,
                    flight.callsign,
                    flight.groundSpeedKts,
                    flight.trackDeg,
                    flight.verticalSpeedFtpm,
                    flight.selectedAltitudeFt
                )
        );

        this.pcds = [];

        for (const pcd of scenario.pcds) {
            const firstFlight = this.flights.find((flight) => flight.id === pcd.firstId);
            const secondFlight = this.flights.find((flight) => flight.id === pcd.secondId);

            if (!firstFlight || !secondFlight) continue;

            this.pcds.push(new Pcd(firstFlight, secondFlight, pcd.minDistanceNM, pcd.timeToMinDistanceMs));
        }

        this.target = this.pcds.filter((pcd) => pcd.isConflict || pcd.isMonitor).length;
    }
}
