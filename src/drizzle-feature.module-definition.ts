import { ConfigurableModuleBuilder } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DrizzleSchema { }

export const { ConfigurableModuleClass: DrizzleFeatureModuleClass, MODULE_OPTIONS_TOKEN: DRIZZLE_SCHEMA }
    = new ConfigurableModuleBuilder<DrizzleSchema>({ moduleName: 'DrizzleFeature' })
        .setClassMethodName('forFeature')
        .build();
