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
