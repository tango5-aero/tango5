import { reset, seed } from 'drizzle-seed';
import { UsersTable } from './schema';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

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

async function main() {
    await reset(db, { UsersTable });
    await seed(db, { UsersTable }, { count: 10 });
}

main();
