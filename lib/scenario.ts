import { z } from 'zod';

export const view = z.object({
    longitude: z.number(),
    latitude: z.number(),
    zoom: z.number()
});

export type View = z.infer<typeof view>;

export const boundaries = z.number().array().length(4);

export type Boundaries = z.infer<typeof boundaries>;

export const flight = z.object({
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

export type Flight = z.infer<typeof flight>;

export const pcd = z.object({
    firstId: z.string(),
    secondId: z.string(),
    currentDist: z.number(),
    minDist: z.number(),
    timeToMinDistMs: z.number()
});

export type Pcd = z.infer<typeof pcd>;

export const scenario = z.object({
    view: view,
    boundaries: boundaries,
    flights: flight.array(),
    pcds: pcd.array()
});

export type Scenario = z.infer<typeof scenario>;
