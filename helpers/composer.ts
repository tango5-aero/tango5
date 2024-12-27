import { circle, Units } from '@turf/turf';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

import { CornerToRectangle, LatLng, LocalGeometry, Rectangle, RectangleToPolygon, SegmentToLine } from './geometry';
import type { Flight, Pcd } from '@/models/flight';

const FLIGHT_BOX_SIZE = 2000;

const HALO_CIRC_STEPS = 25;
const HALO_RADIUS_NM = 5;

function newFeatureCollector() {
    const features: Feature<Geometry, GeoJsonProperties>[] = [];

    const add = {
        lineString: (coords: [LatLng, LatLng], properties: GeoJsonProperties) => {
            features.push({
                type: 'Feature' as const,
                properties,
                geometry: {
                    type: 'LineString' as const,
                    coordinates: SegmentToLine(coords)
                }
            });
        },
        rectangle: (rectangle: Rectangle, properties: GeoJsonProperties) => {
            features.push({
                type: 'Feature' as const,
                properties,
                geometry: {
                    type: 'Polygon' as const,
                    coordinates: [RectangleToPolygon(rectangle)]
                }
            });
        },
        circle: (
            center: number[],
            radius: number,
            options: {
                steps?: number;
                units?: Units;
                properties?: GeoJsonProperties;
            }
        ) => features.push(circle(center, radius, options))
    };

    return Object.freeze({
        add,
        get geoJson(): FeatureCollection {
            return { type: 'FeatureCollection' as const, features: [...features] };
        },
        get features(): Feature[] {
            return [...features];
        }
    });
}

function composeMapElements(flights: Flight[], center: LatLng, showLabels: boolean): Feature[] {
    const features = newFeatureCollector();

    const geometry = new LocalGeometry(center);

    const noOverlap: Rectangle[] = [];

    flights.forEach((flight) => {
        const {
            id,
            ncts,
            pcds,
            points4d: { synced, projected },
            hasHalo
        } = flight;

        const location = {
            lat: synced.latDeg,
            lng: synced.lonDeg,
            alt: synced.altFt
        };

        const projection = {
            lat: projected?.latDeg ?? synced.latDeg,
            lng: projected?.lonDeg ?? synced.lonDeg,
            alt: projected?.altFt
        };

        const nct = ncts.find((nct) => nct !== undefined);

        const { isNct, showHalo } = nct ? nct : { isNct: false, showHalo: false };

        const isPcdFirst = pcds.some((pcd) => (pcd.idOwnShip === id && pcd.isOwnShipFirst) || (pcd.idIntruder === id && !pcd.isOwnShipFirst));

        features.add.lineString([location, projection], { id, type: 'flightSpeed', isNct, isPcdFirst });

        const { min, max } = geometry.bufferPointAsRectangle([location.lng, location.lat], FLIGHT_BOX_SIZE);

        features.add.rectangle({ min: { ...min, alt: location.alt }, max: { ...max, alt: location.alt } }, { id, type: 'flightPosition', isNct, isPcdFirst });

        if (hasHalo || showHalo) {
            features.add.circle([location.lng, location.lat], HALO_RADIUS_NM, {
                steps: HALO_CIRC_STEPS,
                units: 'nauticalmiles',
                properties: { id, type: 'halo', isNct }
            });
        }

        const { min: minProj, max: maxProj } = geometry.bufferPointAsRectangle([projection.lng, projection.lat], FLIGHT_BOX_SIZE);

        noOverlap.push({ min: { ...min, alt: location.alt }, max: { ...max, alt: location.alt } });
        noOverlap.push({ min: { ...minProj, alt: projection.alt }, max: { ...maxProj, alt: projection.alt } });
    });

    const pcds: Pcd[] = [];

    flights.forEach(({ pcds: flightPcds }) => {
        flightPcds.forEach((pcd) => {
            if (!pcds.map(({ id }) => id).includes(pcd.id)) {
                pcds.push(pcd);
            }
        });
    });

    pcds.forEach((pcd) => {
        const {
            id,
            isOwnShipFirst,
            idIntruder,
            sync: { ownShipPosition, intruderPosition },
            mode
        } = pcd;

        const ownLoc = {
            lat: ownShipPosition.latDeg,
            lng: ownShipPosition.lonDeg,
            alt: ownShipPosition.altFt
        };

        const intruderLoc = {
            lat: intruderPosition.latDeg,
            lng: intruderPosition.lonDeg,
            alt: intruderPosition.altFt
        };

        features.add.lineString([ownLoc, intruderLoc], {
            id,
            type: mode
        });

        if (!flights.map(({ id }) => id).includes(idIntruder)) {
            const { min, max } = geometry.bufferPointAsRectangle([intruderLoc.lng, intruderLoc.lat], FLIGHT_BOX_SIZE);

            features.add.rectangle(
                { min: { ...min, alt: intruderLoc.alt }, max: { ...max, alt: intruderLoc.alt } },
                { id, type: 'flightPosition', isFirst: !isOwnShipFirst, isNct: false }
            );

            noOverlap.push({ min: { ...min, alt: intruderLoc.alt }, max: { ...max, alt: intruderLoc.alt } });
        }
    });

    if (showLabels) {
        return features.features;
    }

    pcds.forEach((pcd) => {
        const { id, sync, cpa, warn } = pcd;

        const ownLoc = {
            lat: sync.ownShipPosition.latDeg,
            lng: sync.ownShipPosition.lonDeg,
            alt: sync.ownShipPosition.altFt
        };

        const intruderLoc = {
            lat: sync.intruderPosition.latDeg,
            lng: sync.intruderPosition.lonDeg,
            alt: sync.intruderPosition.altFt
        };

        const epoch = sync.ownShipPosition.epoch;

        const currentDist = sync.distanceNm;

        let segEpoch;

        if (warn.epoch > 0) {
            segEpoch = warn.epoch;
        } else if (cpa.epoch > 0) {
            segEpoch = 0;
        }

        const segDist = cpa.distanceNm;

        const anchor = geometry.middle(ownLoc, intruderLoc);

        //const pcdLineAngle = geometry.bearing([ownLoc.lng, ownLoc.lat], [intruderLoc.lng, intruderLoc.lat]);

        const corners = geometry.findFreeSpot(noOverlap, anchor, 0, 4000, 30000, 15000);

        const rectangle = CornerToRectangle(corners);

        noOverlap.push(rectangle);

        features.add.rectangle(rectangle, { id, type: 'pcdLabel', currentDist, segEpoch, segDist, epoch });
    });

    flights.forEach((flight) => {
        const {
            id,
            callsign,
            points4d: { synced },
            gs,
            selectedAlt,
            aprtArr,
            ncts,
            verticalStatus,
            isSelected,
            isShadowed
        } = flight;

        const location = {
            lat: synced.latDeg,
            lng: synced.lonDeg,
            alt: synced.altFt
        };

        const isNct = ncts.length > 0 && ncts[0]?.isNct;

        const size = 20000;

        const corners = geometry.findFreeSpot(noOverlap, location, 0, size + 10000, size);

        const rectangle = CornerToRectangle(corners);

        noOverlap.push(rectangle);

        features.add.rectangle(rectangle, {
            id,
            type: 'flightLabel',
            callsign,
            alt: location.alt,
            verticalStatus,
            gs,
            selectedAlt,
            nextPoint: aprtArr,
            isSelected,
            isNct,
            isShadowed
        });

        const closestPoint = geometry.closestBorder(location, rectangle);

        features.add.lineString([closestPoint, location], { id, type: 'labelLink', isNct });
    });

    return features.features;
}

export { composeMapElements };
