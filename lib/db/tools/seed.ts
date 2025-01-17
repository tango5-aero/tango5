import { reset, seed } from 'drizzle-seed';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema';
import sc1 from './scenarios-seed/scenario1.json';
import sc2 from './scenarios-seed/scenario2.json';
import sc3 from './scenarios-seed/scenario3.json';

const connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';

neonConfig.fetchEndpoint = `http://postgres:postgres@db.localtest.me:4444/sql`;
neonConfig.useSecureWebSocket = false;
neonConfig.wsProxy = `postgres://postgres:postgres@db.localtest.me:4444/v2`;
neonConfig.webSocketConstructor = ws;

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

const times = ['00:00:05.184', '00:00:10.368', '00:00:12.552', '00:00:24.736', '00:00:26.920', '00:00:30.000'];

async function main() {
    await reset(db, { schema });
    await seed(db, { schema }).refine((f) => ({
        UsersTable: {
            count: 5
        },
        ScenariosTable: {
            count: 3,
            columns: {
                data: f.valuesFromArray({
                    isUnique: true,
                    values: [JSON.stringify(sc1), JSON.stringify(sc2), JSON.stringify(sc3)]
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
}

main();
