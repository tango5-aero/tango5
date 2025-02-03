/** [left, bottom, right, top] */
export type BBox = [number, number, number, number];

/** [x, y ] */
export type Point2D = [number, number];

export type Line = [Point2D, Point2D];

function middle(point: Point2D, otherPoint: Point2D): Point2D {
    return [(point[0] + otherPoint[0]) / 2, (point[1] + otherPoint[1]) / 2];
}

function center(bbox: BBox): Point2D {
    return middle([bbox[0], bbox[1]], [bbox[2], bbox[3]]);
}

function onSegment(p: Point2D, q: Point2D, r: Point2D) {
    return (
        r[0] <= Math.max(p[0], q[0]) &&
        r[0] >= Math.min(p[0], q[0]) &&
        r[1] <= Math.max(p[1], q[1]) &&
        r[1] >= Math.min(p[1], q[1])
    );
}

function crossProduct(p: Point2D, q: Point2D): number {
    return p[0] * q[1] - p[1] * q[0];
}

function intersection(line: Line, otherLine: Line): Point2D | null {
    const [p1, p2] = line;
    const [q1, q2] = otherLine;

    const r: Point2D = [p2[0] - p1[0], p2[1] - p1[1]];
    const s: Point2D = [q2[0] - q1[0], q2[1] - q1[1]];

    const d: Point2D = [q1[0] - p1[0], q1[1] - p1[1]];

    const rs = crossProduct(r, s);

    if (rs === 0) return null;

    const u = crossProduct(d, r) / rs;

    const i: Point2D = [q1[0] + u * s[0], q1[1] + u * s[1]];

    if (!(onSegment(p1, p2, i) && onSegment(q1, q2, i))) return null;

    return i;
}

function intersections(line: Line, bbox: BBox): Point2D[] {
    const [min_x, min_y, max_x, max_y] = bbox;

    const intersections: Point2D[] = [];

    // check if line intersects with the left side of the bbox
    const leftSide: Line = [
        [min_x, min_y],
        [min_x, max_y]
    ];

    const left_intersection = intersection(line, leftSide);

    if (left_intersection) {
        intersections.push(left_intersection);
    }

    // check if line intersects with the right side of the bbox
    const rightSide: Line = [
        [max_x, min_y],
        [max_x, max_y]
    ];

    const right_intersection = intersection(line, rightSide);

    if (right_intersection) {
        intersections.push(right_intersection);
    }

    // check if line intersects with the top side of the bbox
    const topSide: Line = [
        [min_x, max_y],
        [max_x, max_y]
    ];

    const top_intersection = intersection(line, topSide);

    if (top_intersection) {
        intersections.push(top_intersection);
    }

    // check if line intersects with the bottom side of the bbox
    const bottomSide: Line = [
        [min_x, min_y],
        [max_x, min_y]
    ];

    const bottom_intersection = intersection(line, bottomSide);

    if (bottom_intersection) {
        intersections.push(bottom_intersection);
    }

    return intersections;
}
export function closestBorder(point: Point2D, box: BBox): Point2D {
    const boxCenter = center(box);

    const intersection_points = intersections([point, boxCenter], box);

    const intersection_point = intersection_points[0];

    // if (intersection_point === undefined) {
    //     throw new Error('Unexpected number of intersections');
    // }

    return intersection_point ?? point;
}

export function expand(center: Point2D, dx: number, dy: number): Point2D[] {
    const x = center[0];
    const y = center[1];

    return [
        [x - dx, y - dy],
        [x + dx, y - dy],
        [x + dx, y + dy],
        [x - dx, y + dy],
        [x - dx, y - dy]
    ];
}

export function toBBox(square: Point2D[]): BBox {
    function isSquare(square: Point2D[]): asserts square is [Point2D, Point2D, Point2D, Point2D] {
        if (square.length < 4) {
            throw new Error('A square must have at least 4 points');
        }
    }

    isSquare(square);

    const xs = square.map(([x]) => x);
    const ys = square.map(([, y]) => y);

    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

export function toPolygon(bbox: BBox): Point2D[] {
    const [min_x, min_y, max_x, max_y] = bbox;

    return [
        [min_x, min_y],
        [max_x, min_y],
        [max_x, max_y],
        [min_x, max_y],
        [min_x, min_y]
    ];
}

export function destination(anchor: Point2D, track: number, distance: number): Point2D {
    const trackRadians = (track * Math.PI) / 180;
    const transformed: Point2D = [
        anchor[0] + Math.sin(trackRadians) * distance,
        anchor[1] - Math.cos(trackRadians) * distance
    ];

    return transformed;
}

export function distance(anchor: Point2D, point: Point2D): number {
    const [x, y] = anchor;
    const [x1, y1] = point;

    return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
}

export function areDifferent(a: BBox, b: BBox): boolean {
    return a.some((v, i) => v !== b[i]);
}
