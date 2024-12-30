import { readFileSync, writeFileSync } from 'node:fs';
import { flightSchema } from './flight.ts';
import { composeMapElements } from './compose.ts';

const fileContents = readFileSync('./sample_us.json');

const flights = flightSchema.array().parse(JSON.parse(fileContents.toString()));

const geojson = composeMapElements(flights);

writeFileSync('./output.json', JSON.stringify(geojson));
