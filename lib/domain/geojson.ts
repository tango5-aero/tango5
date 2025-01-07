import type { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { closestBorder, expand, toBBox, toPolygon } from './geometry';
import { Movable, spread } from './spreader';
import { Flight } from '~/lib/domain/flight';
import { GeometryTypes } from '~/components/scenario/scenario-map';
import { circle } from '@turf/turf';

type Props = {
    ref: string;
} & (FlightLabel | FlightSpeed | FlightPositionProps | FlightLabelAnchorProps | LabelLink | FlightHaloProps);

type FlightLabel = {
    type: typeof GeometryTypes.label;
};

type LabelLink = {
    type: typeof GeometryTypes.labelLink;
};

type FlightSpeed = {
    type: typeof GeometryTypes.speedVector;
};

type FlightLabelAnchorProps = {
    type: typeof GeometryTypes.labelText;
    text: string;
    fontSize: number;
};

type FlightPositionProps = {
    type: typeof GeometryTypes.position;
};

type FlightHaloProps = {
    type: typeof GeometryTypes.halo;
};

export function measureTextBBox(text: string, fontSize: number): { height: number; width: number } {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context === null) {
        console.error('Could not create canvas context');
        return { height: 0, width: 0 };
    }

    context.font = `${fontSize}px B612`;

    const lines = text.split('\n');

    const metrics = lines.map((line) => context.measureText(line));

    const width = metrics.reduce((prev, curr) => Math.max(prev, curr.width), 0);
    let height = metrics.reduce(
        (prev, curr) => prev + 1.5 * (curr.actualBoundingBoxAscent + curr.actualBoundingBoxDescent),
        0
    );

    const lastMetric = metrics.at(-1);

    if (lastMetric) {
        height = Math.max(height - 0.5 * (lastMetric.actualBoundingBoxAscent + lastMetric.actualBoundingBoxDescent), 0);
    }

    return { height, width };
}

export function featureCollection(
    flights: Flight[],
    selectedFlightsIds: string[],
    scalingFactor: number,
    project: ([lng, lat]: [number, number]) => [x: number, y: number],
    unproject: ([x, y]: [number, number]) => [lng: number, lat: number]
) {
    const collection: FeatureCollection<LineString | Polygon | Point, Props> = {
        type: 'FeatureCollection',
        features: []
    };

    const nonOverlapping: [number, number, number, number][] = [];

    const flightBoxSize = (scalingFactor * 5) / 100;
    const fontSize = flightBoxSize * 4;

    const initialLabels: Movable[] = [];

    for (const flight of flights) {
        const flightPoint2D = project([flight.longitudeDeg, flight.latitudeDeg]);
        const flightPositionSquare = expand(flightPoint2D, flightBoxSize, flightBoxSize);
        const coordinates = [expand(flightPoint2D, flightBoxSize, flightBoxSize).map((point) => unproject(point))];

        collection.features.push({
            type: 'Feature' as const,
            properties: {
                ref: flight.id,
                type: GeometryTypes.position
            },
            geometry: {
                type: 'Polygon' as const,
                coordinates
            }
        });

        nonOverlapping.push(toBBox(flightPositionSquare));

        const leadCoordinates = flight.positionIn(60 * 1_000);

        if (leadCoordinates !== undefined)
            collection.features.push({
                type: 'Feature' as const,
                properties: {
                    ref: flight.id,
                    type: GeometryTypes.speedVector
                },
                geometry: {
                    type: 'LineString' as const,
                    coordinates: [[flight.longitudeDeg, flight.latitudeDeg], leadCoordinates]
                }
            });

        const text = flight.label;

        const textSize = measureTextBBox(text, fontSize);

        const width = Math.max(1, textSize.width / 1.5);
        const height = Math.max(1, textSize.height / 1.5);

        const distance = Math.sqrt(width ** 2 + height ** 2) + 10;

        initialLabels.push({
            ref: flight.id,
            width,
            height,
            anchor: flightPoint2D,
            track: (flight.trackDeg ?? 0) + 90,
            distance
        });

        if (selectedFlightsIds.includes(flight.id)) {
            collection.features.push(
                circle([flight.longitudeDeg, flight.latitudeDeg], 5, {
                    steps: 20,
                    units: 'nauticalmiles',
                    properties: {
                        ref: flight.id,
                        type: GeometryTypes.halo
                    }
                })
            );
        }
    }

    const maxMs = 500;

    const labelPositions = spread(initialLabels, nonOverlapping, maxMs);

    for (const flight of flights) {
        const ref = flight.id;

        if (flight.latitudeDeg === undefined || flight.longitudeDeg === undefined) continue;

        const flightCoordinatesXY = project([flight.longitudeDeg, flight.latitudeDeg]);

        const label = labelPositions.find((label) => label.ref === ref);

        if (label === undefined) continue;

        const labelCenter = unproject([(label.bbox[0] + label.bbox[2]) / 2, (label.bbox[1] + label.bbox[3]) / 2]);

        const coordinates = [toPolygon(label.bbox).map((point) => unproject(point))];

        collection.features.push({
            type: 'Feature' as const,
            properties: {
                ref,
                type: GeometryTypes.label
            },
            geometry: {
                type: 'Polygon' as const,
                coordinates
            }
        });

        const text = flight.label;

        collection.features.push({
            type: 'Feature' as const,
            properties: {
                ref,
                type: GeometryTypes.labelText,
                text,
                fontSize
            },
            geometry: {
                type: 'Point' as const,
                coordinates: labelCenter
            }
        });

        const closestPointXY = closestBorder(flightCoordinatesXY, label.bbox);

        const anchor = unproject(closestPointXY);

        collection.features.push({
            type: 'Feature' as const,
            properties: {
                ref,
                type: GeometryTypes.labelLink
            },
            geometry: {
                type: 'LineString' as const,
                coordinates: [anchor, [flight.longitudeDeg, flight.latitudeDeg]]
            }
        });
    }

    return collection;
}
