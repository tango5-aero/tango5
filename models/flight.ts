import { z } from 'zod';

const verticalStatusSchema = z.union([z.literal('climbing'), z.literal('descending'), z.literal('cruising'), z.literal('unknown')]);

export type VerticalStatus = z.infer<typeof verticalStatusSchema>;

const horizontalStatusSchema = z.union([z.literal('right-turn'), z.literal('left-turn'), z.literal('cruising'), z.literal('unknown')]);

export type HorizontalStatus = z.infer<typeof horizontalStatusSchema>;

const nctModeSchema = z.union([z.literal('acg'), z.literal('soft')]);

const point4dSchema = z.object({
    epoch: z.number(),
    latDeg: z.number(),
    lonDeg: z.number(),
    altFt: z.number().optional()
});

export type Point4d = z.infer<typeof point4dSchema>;

const nctSchema = z.object({
    id: z.string(),
    flightId: z.string(),
    sectorId: z.string(),
    isNct: z.boolean(),
    mode: nctModeSchema,
    showHalo: z.boolean(),
    epoch: z.number(),
    projExit: point4dSchema
});

const pcdMode = z.union([z.literal('STCA'), z.literal('MTCD'), z.literal('forced_STCA'), z.literal('forced_MTCD')]);

export type PcdMode = z.infer<typeof pcdMode>;

const pcdEventSchema = z.object({
    epoch: z.number(),
    distanceNm: z.number(),
    ownShipPosition: point4dSchema,
    intruderPosition: point4dSchema
});

export type pcdEvent = z.infer<typeof pcdEventSchema>;

const pcdSchema = z.object({
    id: z.string(),
    idOwnShip: z.string(),
    idIntruder: z.string(),
    mode: pcdMode,
    isOwnShipFirst: z.boolean(),
    isConflict: z.boolean(),
    isDisplayed: z.boolean(),
    sync: pcdEventSchema,
    buffer: pcdEventSchema.optional(),
    legal: pcdEventSchema.optional(),
    cpa: pcdEventSchema,
    warn: pcdEventSchema
});

export type Pcd = z.infer<typeof pcdSchema>;

export const flightSchema = z.object({
    id: z.string(),
    zone: z.string(),
    gs: z.number().optional(),
    track: z.number().optional(),
    flightLevel: z.number(),
    selectedAlt: z.number().optional(),
    selectedFlightLevel: z.number().optional(),
    selectedHeading: z.number().optional(),
    verticalSpeed: z.number(),
    verticalStatus: verticalStatusSchema,
    horizontalStatus: horizontalStatusSchema,
    callsign: z.string().optional(),
    windSpeedFA: z.number().optional(),
    windDirectionFA: z.number().optional(),
    aprtDep: z.string().optional(),
    aprtArr: z.string().optional(),
    acType: z.string().optional(),
    acReg: z.string().optional(),
    badaFuelAcc: z.number().optional(),
    attitude: z.union([z.literal('CRUISE'), z.literal('CLIMB'), z.literal('DESCENT'), z.literal('')]).optional(),
    computedVz: z.number().optional(),
    points4d: z.object({
        synced: point4dSchema,
        message: point4dSchema.optional(),
        projected: point4dSchema.optional()
    }),
    ncts: z.array(nctSchema),
    pcds: z.array(pcdSchema),

    isSelected: z.boolean().optional(),
    hasHalo: z.boolean().optional(),
    isShadowed: z.boolean().optional()
});

export type Flight = z.infer<typeof flightSchema>;
