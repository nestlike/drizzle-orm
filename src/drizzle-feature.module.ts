import { Inject, Module } from '@nestjs/common';

import {
    DrizzleFeatureModuleClass,
    DrizzleSchema,
    DRIZZLE_SCHEMA
} from './drizzle-feature.module-definition';

class SchemaCollector {

    public schema: Promise<DrizzleSchema> = Promise.resolve({});

    private counter = 0;

    private resolve: (value: DrizzleSchema) => void;

    private _schema: DrizzleSchema = {};

    public register() {
        if (this.counter === 0) {
            this.schema = new Promise(resolve => this.resolve = resolve);
        }

        this.counter++;
    }

    public add(resources: Partial<DrizzleSchema>) {
        this._schema = {...this._schema, ...resources};

        this.counter--;

        if (this.counter === 0) {
            this.resolve(this._schema);
        }
    }

}

export const schemaCollector = new SchemaCollector();

@Module({})
export class DrizzleFeatureModule extends DrizzleFeatureModuleClass {

    constructor(
        @Inject(DRIZZLE_SCHEMA)
        schema: Partial<DrizzleSchema>
    ) {
        super();
        schemaCollector.add(schema);
    }

}
