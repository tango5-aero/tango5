import type { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { closestBorder, expand, toBBox, toPolygon } from './geometry';
import { Movable, spread } from './spreader';
import { Flight } from '~/lib/domain/flight';
import { LayerTypes } from '~/components/scenario-map';

type Props = {
    ref: string;
} & (FlightLabel | FlightSpeed | FlightPositionProps | FlightLabelAnchorProps | LabelLink);

type FlightLabel = {
    type: typeof LayerTypes.label;
};

type LabelLink = {
    type: typeof LayerTypes.labelLink;
};

type FlightSpeed = {
    type: typeof LayerTypes.speedVector;
};

type FlightLabelAnchorProps = {
    type: typeof LayerTypes.labelText;
    text: string;
    fontSize: number;
};

type FlightPositionProps = {
    type: typeof LayerTypes.position;
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

const DEFAULT_FLIGHT_BOX_SIZE = 5; // px
const FONT_BASE_SIZE = 16; // px

export function featureCollection(
    flights: Flight[],
    zoom: number,
    project: ([lng, lat]: [number, number]) => [x: number, y: number],
    unproject: ([x, y]: [number, number]) => [lng: number, lat: number]
) {
    const collection: FeatureCollection<LineString | Polygon | Point, Props> = {
        type: 'FeatureCollection',
        features: []
    };

    const nonOverlapping: [number, number, number, number][] = [];

    const flightBoxSize = (zoom ** 2 * Math.max(DEFAULT_FLIGHT_BOX_SIZE, 1)) / 100;
    const fontSize = (zoom ** 2 * FONT_BASE_SIZE) / 100;

    const initialLabels: Movable[] = [];

    for (const flight of flights) {
        // skip fligths without coordinates
        if (flight.latitudeDeg === undefined || flight.longitudeDeg === undefined) {
            continue;
        }

        const flightPoint2D = project([flight.longitudeDeg, flight.latitudeDeg]);
        const flightPositionSquare = expand(flightPoint2D, flightBoxSize, flightBoxSize);
        const coordinates = [expand(flightPoint2D, flightBoxSize, flightBoxSize).map((point) => unproject(point))];

        collection.features.push({
            type: 'Feature' as const,
            properties: {
                ref: flight.id,
                type: LayerTypes.position
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
                    type: LayerTypes.speedVector
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
                type: LayerTypes.label
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
                type: LayerTypes.labelText,
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
                type: LayerTypes.labelLink
            },
            geometry: {
                type: 'LineString' as const,
                coordinates: [anchor, [flight.longitudeDeg, flight.latitudeDeg]]
            }
        });
    }

    return collection;
}
