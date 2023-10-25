import type {Config} from 'drizzle-kit';

export default {
    schema: './src/db/schema.ts',
    driver: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_PASSWORD,
    },
    verbose: true,
    strict: true,
} satisfies Config;