import { reset, seed } from 'drizzle-seed';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import sc1 from './scenarios-seed/scenario1.json';
import sc2 from './scenarios-seed/scenario2.json';
import sc3 from './scenarios-seed/scenario3.json';

const connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';

neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
    return `${protocol}://${host}:${port}/sql`;
};
const connectionStringUrl = new URL(connectionString);
neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v2` : `${host}/v2`);

neonConfig.webSocketConstructor = ws;

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

const { UsersTable, ScenariosTable } = schema;

async function main() {
    await reset(db, { UsersTable, ScenariosTable });
    await seed(db, { UsersTable, ScenariosTable }).refine((f) => ({
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
        }
    }));
}

main();
