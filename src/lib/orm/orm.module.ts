import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { join } from 'path';

import * as glob from 'fast-glob';
import * as process from 'process';

import { ObjectionModule } from '@src/lib/orm/objection/objection.module';
import { initialize } from 'objection';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('database'),
    }),
  ],
})
export class NestOrmModule {
  async onModuleInit() {
    const entities = await this.getEntities();
    if (entities.length > 0)
      await initialize(entities).then(() =>
        Logger.log('Entities initialized', 'ObjectionModule'),
      );
    else
      Logger.warn(
        'No entities found in dist/modules/**/*.entity.js',
        'ObjectionModule',
      );
  }

  /**
   * @description This function is used to get all entities from the dist folder
   * @experimental This function is experimental and may be removed in future versions
   * @returns {Promise<any[]>}
   */
  async getEntities(): Promise<any[]> {
    const files = await glob('dist/modules/**/*.entity.js');
    const entities = [];

    for (const file of files) {
      const entityModule = await import(join(process.cwd(), file));
      const entity = Object.values(entityModule)[0]; // get the first exported entity
      entities.push(entity);
    }

    return entities;
  }
}
