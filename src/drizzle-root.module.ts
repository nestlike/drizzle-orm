import { Module } from '@nestjs/common';

import type { DrizzleAwsDataApiPgConfig } from 'drizzle-orm/aws-data-api/pg';

import { DRIZZLE_DB } from './drizzle-database.provider';
import { schemaCollector } from './drizzle-feature.module';
import {
    type DrizzleModuleOptions,
    DrizzleRootModuleClass,
    DRIZZLE_MODULE_OPTIONS
} from './drizzle-root.module-definition';

@Module({
    providers: [
        {
            provide: DRIZZLE_DB,
            inject: [DRIZZLE_MODULE_OPTIONS],
            async useFactory(options: DrizzleModuleOptions) {
                const { client, driver } = options;
                const config = options.config || {};

                config.schema = {
                    ...config.schema,
                    ...await schemaCollector.schema
                };

                if (driver === 'aws-data-api-pg') {
                    const { drizzle } = await import('drizzle-orm/aws-data-api/pg');

                    return drizzle(client, config as DrizzleAwsDataApiPgConfig);
                }

                if (driver === 'better-sqlite3') {
                    const { drizzle } = await import('drizzle-orm/better-sqlite3');

                    return drizzle(client, config);
                }

                if (driver === 'd1') {
                    const { drizzle } = await import('drizzle-orm/d1');

                    return drizzle(client, config);
                }

                if (driver === 'libsql') {
                    const { drizzle } = await import('drizzle-orm/libsql');

                    return drizzle(client, config);
                }

                if (driver === 'mysql2') {
                    const { drizzle } = await import('drizzle-orm/mysql2');

                    return drizzle(client, config);
                }

                if (driver === 'neon-serverless') {
                    const { drizzle } = await import('drizzle-orm/neon-serverless');

                    return drizzle(client, config);
                }

                if (driver === 'node-postgres') {
                    const { drizzle } = await import('drizzle-orm/node-postgres');

                    return drizzle(client, config);
                }

                if (driver === 'postgres-js') {
                    const { drizzle } = await import('drizzle-orm/postgres-js');
        
                    return drizzle(client, config);
                }

                if (driver === 'vercel-postgres') {
                    const { drizzle } = await import('drizzle-orm/vercel-postgres');
        
                    return drizzle(client, config);
                }

                throw Error('Unknown database provider');
            }
        }
    ],
    exports: [
        DRIZZLE_DB
    ]
})
export class DrizzleRootModule extends DrizzleRootModuleClass { }
