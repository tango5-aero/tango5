import { defineConfig } from 'drizzle-kit';
import './loadenv';

export default defineConfig({
    schema: './db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL ?? ''
    }
});
