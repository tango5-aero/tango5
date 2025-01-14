import { defineConfig } from 'drizzle-kit';
import './loadenv';

export default defineConfig({
    schema: './lib/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});
