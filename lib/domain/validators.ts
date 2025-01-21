import { z } from 'zod';

export const viewSchema = z.object({
    longitude: z.number(),
    latitude: z.number(),
    zoom: z.number()
});

export type View = z.infer<typeof viewSchema>;

export const boundariesSchema = z.number().array().length(4);

export type Boundaries = z.infer<typeof boundariesSchema>;

export const flightSchema = z.object({
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

export type Flight = z.infer<typeof flightSchema>;

export const pcdSchema = z.object({
    firstId: z.string(),
    secondId: z.string(),
    minDistanceNM: z.number(),
    timeToMinDistanceMs: z.number()
});

export type Pcd = z.infer<typeof pcdSchema>;

export const scenarioSchema = z.object({
    boundaries: boundariesSchema,
    flights: flightSchema.array(),
    pcds: pcdSchema.array()
});

export type Scenario = z.infer<typeof scenarioSchema>;
