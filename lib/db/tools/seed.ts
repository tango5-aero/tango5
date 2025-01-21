import { reset, seed } from 'drizzle-seed';
import * as schema from '../schema';
import sc1 from './scenarios-seed/scenario1.json';
import sc2 from './scenarios-seed/scenario2.json';
import sc3 from './scenarios-seed/scenario3.json';
import { scenarioSchema } from '../../domain/validators';
import { db } from '..';

const times = ['00:00:05.184', '00:00:10.368', '00:00:12.552', '00:00:24.736', '00:00:26.920', '00:00:30.000'];

async function main() {
    console.log('📇 Resetting database...');
    await reset(db, schema);
    console.log('🗑️  Database reset');

    console.log('-----------------------------------');

    console.log('🌱 Seeding database...');
    await seed(db, schema).refine((f) => ({
        UsersTable: {
            count: 5
        },
        ScenariosTable: {
            count: 3,
            columns: {
                data: f.valuesFromArray({
                    isUnique: true,
                    values: [
                        JSON.stringify(scenarioSchema.parse(sc1)),
                        JSON.stringify(scenarioSchema.parse(sc2)),
                        JSON.stringify(scenarioSchema.parse(sc3))
                    ]
                })
            }
        },
        UserGamesTable: {
            count: 10,
            columns: {
                playTime: f.valuesFromArray({
                    values: times
                }),
                success: f.weightedRandom([
                    {
                        weight: 0.2,
                        value: f.default({ defaultValue: false })
                    },
                    {
                        weight: 0.8,
                        value: f.default({ defaultValue: true })
                    }
                ])
            }
        }
    }));
    console.log('🌲🌲🌲 Database seeded');
}

main();
