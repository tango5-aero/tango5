import type { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { closestBorder, expand, toBBox, toPolygon } from './geometry';
import { Movable, spread } from './spreader';
import { Flight } from '~/lib/domain/flight';
import { GeometryTypes } from '~/components/scenario/scenario-map';
import { circle } from '@turf/turf';

type Props =
    | {
          ref: string;
          type:
              | typeof GeometryTypes.position
              | typeof GeometryTypes.speedVector
              | typeof GeometryTypes.label
              | typeof GeometryTypes.labelLink
              | typeof GeometryTypes.pcdLabel;
      }
    | {
          ref: string;
          type: typeof GeometryTypes.labelText;
          text: string;
          fontSize: number;
      }
    | {
          ref: string;
          type: typeof GeometryTypes.halo | typeof GeometryTypes.pcdLink;
          correct: boolean;
      }
    | {
          ref: string;
          type: typeof GeometryTypes.pcdText;
          text: string;
          fontSize: number;
          correct: boolean;
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

export function formatMs(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = (millis % 60000) / 1000;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
}

export function featureCollection(
    flights: Flight[],
    selectedFlight: string | null,
    selectedPairs: [string, string][],
    solutionPairs: [string, string][],
    reveal: boolean,
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
            type: 'Feature',
            properties: {
                ref: flight.id,
                type: GeometryTypes.position
            },
            geometry: {
                type: 'Polygon',
                coordinates
            }
        });

        nonOverlapping.push(toBBox(flightPositionSquare));

        const leadCoordinates = flight.positionIn(60 * 1_000);

        if (leadCoordinates !== undefined)
            collection.features.push({
                type: 'Feature',
                properties: {
                    ref: flight.id,
                    type: GeometryTypes.speedVector
                },
                geometry: {
                    type: 'LineString',
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

        if (selectedFlight === flight.id) {
            collection.features.push(
                circle([flight.longitudeDeg, flight.latitudeDeg], 5, {
                    steps: 20,
                    units: 'nauticalmiles',
                    properties: {
                        ref: flight.id,
                        type: GeometryTypes.halo,
                        correct: solutionPairs.some((pair) => pair.includes(flight.id))
                    }
                })
            );
        }
    }

    const pairs = reveal ? solutionPairs.concat(selectedPairs) : selectedPairs;

    for (const pair of pairs) {
        const flight = flights.find((flight) => flight.id === pair[0]);
        const otherFlight = flights.find((flight) => flight.id === pair[1]);

        if (flight && otherFlight) {
            collection.features.push(
                circle([flight.longitudeDeg, flight.latitudeDeg], 5, {
                    steps: 20,
                    units: 'nauticalmiles',
                    properties: {
                        ref: flight.id,
                        type: GeometryTypes.halo,
                        correct: solutionPairs.some((pair) => pair.includes(flight.id))
                    }
                })
            );

            collection.features.push(
                circle([otherFlight.longitudeDeg, otherFlight.latitudeDeg], 5, {
                    steps: 20,
                    units: 'nauticalmiles',
                    properties: {
                        ref: otherFlight.id,
                        type: GeometryTypes.halo,
                        correct: solutionPairs.some((pair) => pair.includes(otherFlight.id))
                    }
                })
            );

            const id = flight < otherFlight ? `${flight.id}-${otherFlight.id}` : `${otherFlight.id}-${flight.id}`;

            collection.features.push({
                type: 'Feature',
                properties: {
                    ref: id,
                    type: GeometryTypes.pcdLink,
                    correct: solutionPairs.some(
                        (pair) =>
                            (pair[0] === flight.id && pair[1] === otherFlight.id) ||
                            (pair[0] === otherFlight.id && pair[1] === flight.id)
                    )
                },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [flight.longitudeDeg, flight.latitudeDeg],
                        [otherFlight.longitudeDeg, otherFlight.latitudeDeg]
                    ]
                }
            });

            const measure = flight.measureDistanceTo(otherFlight);

            if (!measure) continue;

            const minimumDistanceText =
                'minimumDistanceNM' in measure && 'timeToMinimumDistanceMs' in measure
                    ? `\r\n${measure.minimumDistanceNM.toFixed(1)}NM ${formatMs(measure.timeToMinimumDistanceMs)}`
                    : '';

            const text = `${measure.currentDistanceNM.toFixed(1)}NM${minimumDistanceText}`;

            const textSize = measureTextBBox(text, fontSize);

            const width = Math.max(1, textSize.width / 1.5);
            const height = Math.max(1, textSize.height / 1.5);

            const labelCenter = [
                (flight.longitudeDeg + otherFlight.longitudeDeg) / 2,
                (flight.latitudeDeg + otherFlight.latitudeDeg) / 2
            ] as [number, number];

            const label = expand(project(labelCenter), width, height);

            const coordinates = [label.map((point) => unproject(point))];

            nonOverlapping.push(toBBox(label));

            collection.features.push({
                type: 'Feature',
                properties: {
                    ref: id,
                    type: GeometryTypes.pcdLabel
                },
                geometry: {
                    type: 'Polygon',
                    coordinates
                }
            });

            collection.features.push({
                type: 'Feature',
                properties: {
                    ref: id,
                    type: GeometryTypes.pcdText,
                    text,
                    fontSize,
                    correct: solutionPairs.some(
                        (pair) =>
                            (pair[0] === flight.id && pair[1] === otherFlight.id) ||
                            (pair[0] === otherFlight.id && pair[1] === flight.id)
                    )
                },
                geometry: {
                    type: 'Point',
                    coordinates: labelCenter
                }
            });
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
            type: 'Feature',
            properties: {
                ref,
                type: GeometryTypes.label
            },
            geometry: {
                type: 'Polygon',
                coordinates
            }
        });

        const text = flight.label;

        collection.features.push({
            type: 'Feature',
            properties: {
                ref,
                type: GeometryTypes.labelText,
                text,
                fontSize
            },
            geometry: {
                type: 'Point',
                coordinates: labelCenter
            }
        });

        const closestPointXY = closestBorder(flightCoordinatesXY, label.bbox);

        const anchor = unproject(closestPointXY);

        collection.features.push({
            type: 'Feature',
            properties: {
                ref,
                type: GeometryTypes.labelLink
            },
            geometry: {
                type: 'LineString',
                coordinates: [anchor, [flight.longitudeDeg, flight.latitudeDeg]]
            }
        });
    }

    return collection;
}
