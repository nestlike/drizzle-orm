import { ConfigurableModuleAsyncOptions, DynamicModule, Module } from '@nestjs/common';

import type { DrizzleSchema } from './drizzle-feature.module-definition';
import { DrizzleFeatureModule, schemaCollector } from './drizzle-feature.module';
import type { DrizzleModuleOptions } from './drizzle-root.module-definition';
import { DrizzleRootModule } from './drizzle-root.module';

@Module({})
export class DrizzleModule {

    public static forRoot(options: DrizzleModuleOptions): DynamicModule {
        return {
            module: DrizzleModule,
            global: true,
            imports: [
                DrizzleRootModule.forRoot(options)
            ],
            exports: [
                DrizzleRootModule
            ]
        }
    }

    public static forRootAsync(asyncOptions: ConfigurableModuleAsyncOptions<DrizzleModuleOptions, 'create'>): DynamicModule {
        return {
            module: DrizzleModule,
            global: true,
            imports: [
                DrizzleRootModule.forRootAsync(asyncOptions)
            ],
            exports: [
                DrizzleRootModule
            ]
        }
    }

    public static forFeature(schema: Partial<DrizzleSchema>): DynamicModule {
        schemaCollector.register();

        return {
            module: DrizzleModule,
            imports: [
                DrizzleFeatureModule.forFeature(schema)
            ]
        }
    }

    public static forFeatureAsync(asyncSchema: ConfigurableModuleAsyncOptions<Partial<DrizzleSchema>, 'create'>): DynamicModule {
        schemaCollector.register();

        return {
            module: DrizzleModule,
            imports: [
                DrizzleFeatureModule.forFeatureAsync(asyncSchema)
            ]
        }
    }

}
