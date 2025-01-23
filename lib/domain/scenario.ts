import { Flight } from './flight';
import { Pcd } from './pcd';

import { z } from 'zod';

const boundariesSchema = z.number().array().length(4);

const flightSchema = z.object({
    id: z.string(),
    callsign: z.string(),
    latitudeDeg: z.number(),
    longitudeDeg: z.number(),
    altitudeFt: z.number(),
    groundSpeedKts: z.number(),
    trackDeg: z.number(),
    verticalSpeedFtpm: z.number(),
    selectedAltitudeFt: z.number()
});

const pcdSchema = z.object({
    firstId: z.string(),
    secondId: z.string(),
    minDistanceNM: z.number(),
    timeToMinDistanceMs: z.number()
});

export const scenarioSchema = z.object({
    boundaries: boundariesSchema,
    flights: flightSchema.array(),
    pcds: pcdSchema.array()
});

export type ScenarioData = z.infer<typeof scenarioSchema>;

export class Scenario {
    public readonly boundaries: [number, number, number, number];
    public readonly flights: Flight[];
    public readonly pcds: Pcd[];

    constructor(scenario: ScenarioData) {
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
