import type { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { closestBorder, expand, toBBox, toPolygon } from './geometry';
import { Movable, spread } from './spreader';
import { GeometryTypes } from '~/components/scenario/scenario-map';
import { circle } from '@turf/turf';
import { Scenario } from './scenario';

type Status = 'conflict' | 'monitor' | 'clear' | undefined;

type Props =
    | {
          ref: string;
          type:
              | typeof GeometryTypes.position
              | typeof GeometryTypes.speedVector
              | typeof GeometryTypes.label
              | typeof GeometryTypes.labelLink
              | typeof GeometryTypes.halo;
      }
    | {
          ref: string;
          type: typeof GeometryTypes.labelText;
          text: string;
          fontSize: number;
      }
    | {
          ref: string;
          type: typeof GeometryTypes.pcdLink | typeof GeometryTypes.pcdLabel;
          status: Status;
      }
    | {
          ref: string;
          type: typeof GeometryTypes.pcdText;
          text: string;
          fontSize: number;
          status: Status;
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
    scenario: Scenario,
    selectedFlight: string | null,
    selectedPairs: [string, string][],
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

    for (const flight of scenario.flights) {
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
                        type: GeometryTypes.halo
                    }
                })
            );
        }
    }

    const pairs = reveal
        ? scenario.solution.map((pcd) => [pcd.firstFlight.id, pcd.secondFlight.id]).concat(selectedPairs)
        : selectedPairs;

    for (const pair of pairs) {
        const flight = scenario.flights.find((flight) => flight.id === pair[0]);
        const otherFlight = scenario.flights.find((flight) => flight.id === pair[1]);

        if (flight && otherFlight) {
            const id = flight < otherFlight ? `${flight.id}-${otherFlight.id}` : `${otherFlight.id}-${flight.id}`;

            const pcd = scenario.pcds.find(
                (pcd) =>
                    (pcd.firstFlight.id === flight.id && pcd.secondFlight.id === otherFlight.id) ||
                    (pcd.secondFlight.id === flight.id && pcd.firstFlight.id === otherFlight.id)
            );

            const currentDistanceNM = flight.distanceToNM(otherFlight);

            let status: Status = undefined;
            let statusText: string;

            switch (true) {
                case pcd?.isSafe:
                    status = 'clear';
                    statusText = 'GOOD TO GO';
                    break;
                case pcd?.isMonitor:
                    status = 'monitor';
                    statusText = 'MONITOR';
                    break;
                case pcd?.isConflict:
                    status = 'conflict';
                    statusText = 'CONFLICT';
                    break;
                default:
                    statusText = 'GOOD TO GO';
            }

            const text = `${statusText}\n${currentDistanceNM.toFixed(1)}NM${pcd?.description ? `\r\n${pcd.description}` : ''}`;

            const textSize = measureTextBBox(text, fontSize);

            const width = Math.max(1, textSize.width / 1.5);
            const height = Math.max(1, textSize.height / 1.25);

            const flightViewSpace = project([flight.longitudeDeg, flight.latitudeDeg]);
            const otherFlightViewSpace = project([otherFlight.longitudeDeg, otherFlight.latitudeDeg]);

            const flightsMidPoint = [
                (flightViewSpace[0] + otherFlightViewSpace[0]) / 2,
                (flightViewSpace[1] + otherFlightViewSpace[1]) / 2
            ];

            const ratio =
                flightsMidPoint[1] !== 0
                    ? (flightViewSpace[0] - otherFlightViewSpace[0]) / (flightViewSpace[1] - otherFlightViewSpace[1])
                    : -1;

            const labelCenter = (
                ratio > 0
                    ? [flightsMidPoint[0] + width, flightsMidPoint[1] - height]
                    : [flightsMidPoint[0] - width, flightsMidPoint[1] - height]
            ) as [number, number];

            const label = expand(labelCenter, width, height);

            const coordinates = [label.map((point) => unproject(point))];

            nonOverlapping.push(toBBox(label));

            collection.features.push({
                type: 'Feature',
                properties: {
                    ref: id,
                    type: GeometryTypes.pcdLink,
                    status
                },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [flight.longitudeDeg, flight.latitudeDeg],
                        [otherFlight.longitudeDeg, otherFlight.latitudeDeg]
                    ]
                }
            });

            collection.features.push({
                type: 'Feature',
                properties: {
                    ref: id,
                    type: GeometryTypes.pcdLabel,
                    status
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
                    status
                },
                geometry: {
                    type: 'Point',
                    coordinates: unproject(labelCenter)
                }
            });
        }
    }

    const maxMs = 500;

    const labelPositions = spread(initialLabels, nonOverlapping, maxMs);

    for (const flight of scenario.flights) {
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
