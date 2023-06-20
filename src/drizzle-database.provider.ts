import type { AwsDataApiPgDatabase as GenericAwsDataApiPgDatabase } from 'drizzle-orm/aws-data-api/pg';
import type { BetterSQLite3Database as GenericBetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { DrizzleD1Database as GenericDrizzleD1Database } from 'drizzle-orm/d1';
import type { LibSQLDatabase as GenericLibSQLDatabase } from 'drizzle-orm/libsql';
import type { MySql2Database as GenericMySql2Database } from 'drizzle-orm/mysql2';
import type { NeonDatabase as GenericNeonDatabase } from 'drizzle-orm/neon-serverless';
import type { NodePgDatabase as GenericNodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PostgresJsDatabase as GenericPostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { VercelPgDatabase as GenericVercelPgDatabase } from 'drizzle-orm/vercel-postgres';

import { DrizzleSchema } from './drizzle-feature.module-definition';

export const DRIZZLE_DB = Symbol('DRIZZLE_DB');

// @ts-expect-error schema
export type AwsDataApiPgDatabase = GenericAwsDataApiPgDatabase<DrizzleSchema>;

// @ts-expect-error schema
export type BetterSQLite3Database = GenericBetterSQLite3Database<DrizzleSchema>;

// @ts-expect-error schema
export type DrizzleD1Database = GenericDrizzleD1Database<DrizzleSchema>;

// @ts-expect-error schema
export type LibSQLDatabase = GenericLibSQLDatabase<DrizzleSchema>;

// @ts-expect-error schema
export type MySql2Database = GenericMySql2Database<DrizzleSchema>;

// @ts-expect-error schema
export type NeonDatabase = GenericNeonDatabase<DrizzleSchema>;

// @ts-expect-error schema
export type NodePgDatabase = GenericNodePgDatabase<DrizzleSchema>;

// @ts-expect-error schema
export type PostgresJsDatabase = GenericPostgresJsDatabase<DrizzleSchema>;

// @ts-expect-error schema
export type VercelPgDatabase = GenericVercelPgDatabase<DrizzleSchema>;
