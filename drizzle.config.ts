import { defineConfig } from 'drizzle-kit';
import './lib/db/env';

export default defineConfig({
    schema: './db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL ?? ''
    }
});
