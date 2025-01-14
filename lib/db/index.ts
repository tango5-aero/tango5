import '~/loadenv';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
import { neonConfig } from '@neondatabase/serverless';
import { sql } from '@vercel/postgres';

if (process.env.VERCEL_ENV === 'development') {
    neonConfig.wsProxy = (host) => `${host}:54330/v1`;
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
}

export const db = drizzle(sql, { schema });
