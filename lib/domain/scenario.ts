import { Flight } from './flight';
import { Pcd } from './pcd';
import { Scenario as ScenarioDTO } from './validators';

export class Scenario {
    public readonly boundaries: [number, number, number, number];
    public readonly flights: Flight[];
    public readonly pcds: Pcd[];

    constructor(scenario: ScenarioDTO) {
        this.boundaries = scenario.boundaries as [number, number, number, number];

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
    }

    get solution() {
        return this.pcds.filter((pcd) => pcd.isMonitor || pcd.isConflict);
    }

    isSolution(solutionPairs: [string, string][]) {
        return this.solution.every((pcd) =>
            solutionPairs.some(
                (pair) =>
                    (pair[0] === pcd.firstFlight.id && pair[1] === pcd.secondFlight.id) ||
                    (pair[0] === pcd.secondFlight.id && pair[1] === pcd.firstFlight.id)
            )
        );
    }

    numberCorrect(solutionPairs: [string, string][]) {
        return this.solution.filter((conflict) =>
            solutionPairs.some(
                (pair) =>
                    (pair[0] === conflict.firstFlight.id && pair[1] === conflict.secondFlight.id) ||
                    (pair[0] === conflict.secondFlight.id && pair[1] === conflict.firstFlight.id)
            )
        ).length;
    }
}
