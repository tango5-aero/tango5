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
    callsign: z.string().optional(),
    category: z.string().optional(),
    latitudeDeg: z.number(),
    longitudeDeg: z.number(),
    groundSpeedKts: z.number().optional(),
    trackDeg: z.number().optional(),
    altitudeFt: z.number().optional(),
    verticalSpeedFtpm: z.number().optional(),
    selectedAltitudeFt: z.number().optional()
});

export type Flight = z.infer<typeof flightSchema>;

export const pcdSchema = z.object({
    firstId: z.string(),
    secondId: z.string(),
    currentDist: z.number(),
    minDist: z.number(),
    timeToMinDistMs: z.number()
});

export type Pcd = z.infer<typeof pcdSchema>;

export const scenarioSchema = z.object({
    view: viewSchema,
    boundaries: boundariesSchema,
    flights: flightSchema.array(),
    pcds: pcdSchema.array()
});

export type Scenario = z.infer<typeof scenarioSchema>;
