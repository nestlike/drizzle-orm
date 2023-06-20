import { ConfigurableModuleBuilder } from '@nestjs/common';

import type { RDSDataClient } from '@aws-sdk/client-rds-data';
import type { Client } from '@libsql/client';
import type { Database } from 'better-sqlite3';
import type { DrizzleConfig } from 'drizzle-orm';
import type { DrizzleAwsDataApiPgConfig } from 'drizzle-orm/aws-data-api/pg';
import type { MySql2Client } from 'drizzle-orm/mysql2';
import type { NeonClient } from 'drizzle-orm/neon-serverless';
import type { NodePgClient } from 'drizzle-orm/node-postgres';
import type { VercelPgClient } from 'drizzle-orm/vercel-postgres';
import type { Sql } from 'postgres';

export type DrizzleModuleOptions = AwsDataApiPgOptions
    | BetterSQLite3Options
    | DrizzleD1Options
    | LibSQLOptions
    | MySql2Options
    | NeonOptions
    | NodePgOptions
    | PostgresJsOptions
    | VercelPgOptions;

export interface AwsDataApiPgOptions {
    driver: 'aws-data-api-pg';
    client: RDSDataClient;
    config?: DrizzleAwsDataApiPgConfig;
}

export interface BetterSQLite3Options {
    driver: 'better-sqlite3';
    client: Database;
    config?: DrizzleConfig;
}

export interface DrizzleD1Options {
    driver: 'd1';
    client: D1Database;
    config?: DrizzleConfig;
}

export interface LibSQLOptions {
    driver: 'libsql';
    client: Client;
    config?: DrizzleConfig;
}

export interface MySql2Options {
    driver: 'mysql2';
    client: MySql2Client;
    config?: DrizzleConfig;
}

export interface NeonOptions {
    driver: 'neon-serverless';
    client: NeonClient;
    config?: DrizzleConfig;
}

export interface NodePgOptions {
    driver: 'node-postgres';
    client: NodePgClient;
    config?: DrizzleConfig;
}

export interface PostgresJsOptions {
    driver: 'postgres-js';
    client: Sql;
    config?: DrizzleConfig;
}

export interface VercelPgOptions {
    driver: 'vercel-postgres';
    client: VercelPgClient;
    config?: DrizzleConfig;
}

export const { ConfigurableModuleClass: DrizzleRootModuleClass, MODULE_OPTIONS_TOKEN: DRIZZLE_MODULE_OPTIONS }
    = new ConfigurableModuleBuilder<DrizzleModuleOptions>({ moduleName: 'DrizzleRoot' })
        .setClassMethodName('forRoot')
        .build();
