import { z } from 'zod';

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
