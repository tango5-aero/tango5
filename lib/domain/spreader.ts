import { destination, expand, toBBox, type BBox, type Point2D } from './geometry';

export type Movable = {
    ref: string;
    width: number;
    height: number;
    anchor: Point2D;
    track: number;
    distance: number;
};

type Spread = {
    ref: string;
    bbox: BBox;
};

export function overlap([l1, t1, r1, b1]: BBox, [l2, t2, r2, b2]: BBox): boolean {
    // x-axis intersection
    if (l1 >= r2 || l2 >= r1) return false;

    // y-axis intersection
    if (t1 >= b2 || t2 >= b1) return false;

    return true;
}

function getBBox(movable: Movable): BBox {
    const center = destination(movable.anchor, movable.track, movable.distance);

    const rectangle = expand(center, movable.width, movable.height);

    return toBBox(rectangle);
}

const angle_range = 60;
const tracks: number[] = [];
const step = 1;

let min_angle = -angle_range / 2;
let max_angle = angle_range / 2;
let i = 0;
while (min_angle + i * step <= max_angle) {
    tracks.push(min_angle + i * step);
    i++;
}

min_angle = 90 - angle_range / 2;
max_angle = 90 + angle_range / 2;
i = 0;
while (min_angle + i * step <= max_angle) {
    tracks.push(min_angle + i * step);
    i++;
}

const max_dist = 100;
const dist_step = 10;
function* transformer() {
    let distance = 0;

    while (distance < max_dist) {
        for (const track of tracks) {
            yield { track, distance };
        }

        distance += dist_step;
    }
}

export function spread(movables: Movable[], fixed: BBox[], timeout: number): Spread[] {
    const time_init = performance.now();

    let elapsed = 0;

    movables.sort();

    const placed = fixed;

    for (const movable of movables) {
        let bbox = getBBox(movable);

        for (const transform of transformer()) {
            movable.track += transform.track;
            movable.distance += transform.distance;

            bbox = getBBox(movable);

            if (!placed.some((otherBbox) => overlap(bbox, otherBbox))) {
                break;
            }
        }

        placed.push(bbox);

        elapsed += performance.now() - time_init;

        if (elapsed >= timeout) {
            break;
        }
    }

    // console.log(`spread report: ${(performance.now() - time_init).toFixed(2)}ms`);

    return movables.map((movable) => ({
        ref: movable.ref,
        bbox: getBBox(movable)
    }));
}
