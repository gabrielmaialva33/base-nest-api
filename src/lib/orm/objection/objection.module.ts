import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';

import {
  DatabaseAsyncOptions,
  DatabaseAsyncOptionsFactory,
  DatabaseOptions,
} from '@src/lib/orm/objection/objection.interface';

import { ObjectionConstants } from '@src/lib/orm/objection/objection.constants';
import { ObjectionService } from '@src/lib/orm/objection/objection.service';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class ObjectionModule {
  static register(options: DatabaseOptions): DynamicModule {
    return {
      global: options.isGlobal || true,
      module: ObjectionModule,
      imports: [DiscoveryModule],
      providers: [
        ObjectionService,
        { provide: ObjectionConstants.databaseOptions, useValue: options },
      ],
      exports: [],
    };
  }

  static registerAsync(options: DatabaseAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal || true,
      module: ObjectionModule,
      imports: [DiscoveryModule],
      providers: [this.options_provider(options), ObjectionService],
      exports: [],
    };
  }

  private static options_provider(options: DatabaseAsyncOptions): Provider {
    if (options.useFactory)
      return {
        provide: ObjectionConstants.databaseOptions,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };

    const inject = [
      (options.useClass || options.useExisting) as Type<DatabaseOptions>,
    ];

    return {
      provide: ObjectionConstants.databaseOptions,
      useFactory: async (optionsFactory: DatabaseAsyncOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject,
    };
  }
}
