import { readFileSync, writeFileSync } from 'node:fs';
import { flightSchema } from './model.ts';

const fileContents = readFileSync('./sample_us.json');

const data = flightSchema.array().parse(JSON.parse(fileContents.toString()));

const flights = [];

for (const item of data) {
    flights.push({
        id: item.id,
        callsign: item.callsign,
        category: item.acType,
        latitudeDeg: item.points4d.synced.latDeg,
        longitudeDeg: item.points4d.synced.lonDeg,
        groundSpeedKts: item.gs,
        trackDeg: item.track,
        altitudeFt: item.points4d.synced.altFt,
        verticalSpeedFtpm: item.verticalSpeed,
        selectedAltitudeFt: item.selectedAlt
    });
}

const pcds = [];
const collected = new Set();

for (const item of data) {
    for (const pcd of item.pcds) {
        if (pcd.isConflict && !collected.has(pcd.id)) {
            pcds.push({
                firstId: pcd.isOwnShipFirst ? pcd.idOwnShip : pcd.idIntruder,
                secondId: pcd.isOwnShipFirst ? pcd.idIntruder : pcd.idOwnShip,
                currentDist: pcd.sync.distanceNm,
                minDist: pcd.cpa.distanceNm,
                timeToMinDistMs: pcd.cpa.epoch - pcd.sync.epoch
            });

            collected.add(pcd.id);
        }
    }
}

const scenario = {
    name: 'Sample scenario from victor5 data',
    id: 'sample-1',
    view: {
        longitude: -76.96729,
        latitude: 35.78202,
        zoom: 7
    },
    boundaries: [-85.5, 24.18, -67.8, 46.3],
    flights,
    pcds
};

writeFileSync('./output.json', JSON.stringify(scenario));
