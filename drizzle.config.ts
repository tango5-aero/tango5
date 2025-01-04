import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
    schema: './db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.VERCEL_DATABASE_URL ?? ''
    }
});
