import CheapRuler, { type BBox, type Point } from 'cheap-ruler';

interface LatLng {
    lat: number;
    lng: number;
    alt?: number;
}

interface Rectangle {
    min: LatLng;
    max: LatLng;
}

type Segment = [LatLng, LatLng];

type Corners = [[w: number, n: number], [e: number, n: number], [e: number, s: number], [w: number, s: number]];

function* stepsGenerator(initAngle = 0, stepAngle = 0, initDistance = 0, stepDistance = 0, maxDistance = 0): IterableIterator<{ angle: number; distance: number }> {
    const state = { angle: wrap360(initAngle), distance: initDistance };

    let rotation = 0;

    while (rotation < 360 && stepAngle > 0) {
        state.angle = wrap360(initAngle + rotation);

        yield state;

        rotation += stepAngle;
    }

    state.distance = state.distance + stepDistance;

    while (state.distance <= maxDistance && stepDistance > 0) {
        let rotation = 0;
        state.angle = wrap360(initAngle);

        while (rotation < 360 && stepAngle > 0) {
            state.angle = wrap360(initAngle + rotation);

            yield state;

            rotation += stepAngle;
        }

        state.distance = state.distance + stepDistance;
    }

    return;
}

function wrap360(deg: number) {
    while (deg < 0) deg += 360;
    while (deg >= 360) deg -= 360;
    return deg;
}

function CornerToRectangle(corners: Corners): Rectangle {
    return { min: { lat: corners[3][1], lng: corners[3][0] }, max: { lat: corners[1][1], lng: corners[1][0] } };
}

function RectangleToCorners(rectangle: Rectangle): Corners {
    return [
        [rectangle.min.lng, rectangle.max.lat],
        [rectangle.max.lng, rectangle.max.lat],
        [rectangle.max.lng, rectangle.min.lat],
        [rectangle.min.lng, rectangle.min.lat]
    ];
}

function RectangleToPolygon(rectangle: Rectangle) {
    return [
        [rectangle.min.lng, rectangle.max.lat],
        [rectangle.max.lng, rectangle.max.lat],
        [rectangle.max.lng, rectangle.min.lat],
        [rectangle.min.lng, rectangle.min.lat],
        [rectangle.min.lng, rectangle.max.lat]
    ];
}

function SegmentToLine(segment: Segment): [[number, number, number], [number, number, number]] {
    return [
        [segment[0].lng, segment[0].lat, segment[0].alt || 0],
        [segment[1].lng, segment[1].lat, segment[1].alt || 0]
    ];
}

class LocalGeometry extends CheapRuler {
    constructor(point: LatLng) {
        super(point.lat, 'meters');
    }

    middle(loc: LatLng, otherLoc: LatLng): LatLng {
        return { lat: (loc.lat + otherLoc.lat) / 2, lng: (loc.lng + otherLoc.lng) / 2 };
    }

    center(rectangle: Rectangle): LatLng {
        return this.middle(rectangle.min, rectangle.max);
    }

    size(rectangle: Rectangle): { height: number; width: number } {
        return {
            height: this.distance([rectangle.max.lng, rectangle.min.lat], [rectangle.max.lng, rectangle.max.lat]),
            width: this.distance([rectangle.min.lng, rectangle.max.lat], [rectangle.max.lng, rectangle.max.lat])
        };
    }

    rotateAlongSquare(center: LatLng, angle: number, side: number): LatLng {
        const bearing = wrap360(angle);

        const top = bearing >= 315 || bearing < 45;
        const right = bearing >= 45 && bearing < 135;
        const bottom = bearing >= 135 && bearing < 225;
        const left = bearing >= 225 && bearing < 315;

        let [lng, lat]: [number | undefined, number | undefined] = [undefined, undefined];

        switch (true) {
            case top:
                [lng, lat] = this.destination([center.lng, center.lat], side / 2 / Math.cos((bearing * Math.PI) / 180), bearing);
                break;
            case bottom:
                [lng, lat] = this.destination([center.lng, center.lat], side / 2 / Math.cos(-(bearing * Math.PI) / 180), bearing + 180);
                break;
            case right:
                [lng, lat] = this.destination([center.lng, center.lat], side / 2 / Math.sin((bearing * Math.PI) / 180), bearing);
                break;
            case left:
                [lng, lat] = this.destination([center.lng, center.lat], side / 2 / Math.sin(-(bearing * Math.PI) / 180), bearing);
                break;
        }

        return lat && lng ? { lat, lng } : center;
    }

    rotate(center: LatLng, bearing: number, distance: number): LatLng {
        const [lng, lat] = this.destination([center.lng, center.lat], distance, bearing);
        return { lat, lng };
    }

    bufferPointAsRectangle(p: Point, buffer: number): Rectangle {
        const [w, s, e, n]: BBox = this.bufferPoint(p, buffer);

        return { min: { lat: s, lng: w }, max: { lat: n, lng: e } };
    }

    bufferPointAsPolygon(p: Point, buffer: number) {
        const [w, s, e, n]: BBox = this.bufferPoint(p, buffer);

        return [
            [w, n],
            [e, n],
            [e, s],
            [w, s],
            [w, n]
        ];
    }

    bufferPointAsCorners(p: Point, buffer: number): Corners {
        const [w, s, e, n]: BBox = this.bufferPoint(p, buffer);

        return [
            [w, n],
            [e, n],
            [e, s],
            [w, s]
        ];
    }

    moveTo(rectangle: Rectangle, newCenter: LatLng): Rectangle {
        const center = this.center(rectangle);

        const delta_lat = center.lat - newCenter.lat;
        const delta_lng = center.lng - newCenter.lng;

        return {
            min: { lat: rectangle.min.lat - delta_lat, lng: rectangle.min.lng - delta_lng },
            max: { lat: rectangle.max.lat - delta_lat, lng: rectangle.max.lng - delta_lng }
        };
    }

    equals(rectangle: Rectangle, otherRectangle: Rectangle): boolean {
        return (
            wrap360(otherRectangle.min.lat) === wrap360(rectangle.min.lat) &&
            wrap360(otherRectangle.min.lng) === wrap360(rectangle.min.lng) &&
            wrap360(otherRectangle.max.lat) === wrap360(rectangle.max.lat) &&
            wrap360(otherRectangle.max.lng) === wrap360(rectangle.max.lng)
        );
    }

    overlapsRectangle(rectangle: Rectangle, otherRectangle: Rectangle): boolean {
        return (
            wrap360(rectangle.min.lat) <= wrap360(otherRectangle.max.lat) &&
            wrap360(rectangle.min.lng) <= wrap360(otherRectangle.max.lng) &&
            wrap360(rectangle.max.lat) >= wrap360(otherRectangle.min.lat) &&
            wrap360(rectangle.max.lng) >= wrap360(otherRectangle.min.lng)
        );
    }

    overlapsRectangles(rectangle: Rectangle, rectangles: Rectangle[]): boolean {
        return rectangles.some((otherRectangle) => !this.equals(rectangle, otherRectangle) && this.overlapsRectangle(rectangle, otherRectangle));
    }

    findFreeSpot(layout: Rectangle[], anchor: LatLng, bearing: number, distance: number, width: number, height?: number): Corners {
        const center = this.rotateAlongSquare(anchor, bearing, distance);

        bearing = wrap360(bearing);

        const [minLng, minLat] = this.offset([center.lng, center.lat], -width / 2, height ? -height / 2 : -width / 2);
        const [maxLng, maxLat] = this.offset([center.lng, center.lat], width / 2, height ? height / 2 : width / 2);

        let box = {
            min: { lat: minLat, lng: minLng },
            max: { lat: maxLat, lng: maxLng }
        };

        const steps = stepsGenerator(bearing, 45, distance, distance, distance * 4);

        let step = steps.next();

        let isOverlapping = this.overlapsRectangles(box, layout);

        while (!step.done && isOverlapping) {
            const newCenter = this.rotateAlongSquare(anchor, step.value.angle, step.value.distance);

            box = this.moveTo(box, newCenter);

            isOverlapping = this.overlapsRectangles(box, layout);

            step = steps.next();
        }

        return RectangleToCorners(box);
    }

    getBox(_layout: Rectangle[], anchor: LatLng, bearing: number, distance: number, width: number, height?: number): Corners {
        const center = this.rotateAlongSquare(anchor, bearing, distance);

        bearing = wrap360(bearing);

        const [minLng, minLat] = this.offset([center.lng, center.lat], -width / 2, height ? -height / 2 : -width / 2);
        const [maxLng, maxLat] = this.offset([center.lng, center.lat], width / 2, height ? height / 2 : width / 2);

        const box = {
            min: { lat: minLat, lng: minLng },
            max: { lat: maxLat, lng: maxLng }
        };

        return RectangleToCorners(box);
    }

    closestBorder(point: LatLng, rectangle: Rectangle): LatLng {
        const center = this.center(rectangle);

        const bearing = this.bearing([center.lng, center.lat], [point.lng, point.lat]);

        const { height } = this.size(rectangle);

        return this.rotateAlongSquare(center, bearing, height);
    }
}

export { LocalGeometry, CornerToRectangle, RectangleToPolygon, SegmentToLine, stepsGenerator };
export type { LatLng, Rectangle };
