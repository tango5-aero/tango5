import '~/loadenv';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';
import { neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (process.env.VERCEL_ENV === 'development') {
    neonConfig.wsProxy = (host) => `${host}:54330/v1`;
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
}

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
