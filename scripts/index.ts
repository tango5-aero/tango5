import { readFileSync, writeFileSync } from 'node:fs';
import { flightSchema } from './legacy-model.ts';
import { translate } from './translate.ts';

const fileContents = readFileSync('./sample_us.json');

const flights = flightSchema.array().parse(JSON.parse(fileContents.toString()));

const geojson = translate(flights);

writeFileSync('./output.json', JSON.stringify(geojson));
