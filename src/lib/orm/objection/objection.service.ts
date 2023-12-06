import Knex, { Knex as KnexType } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'objection';
//import { BaseEntity } from '@src/lib/orm/objection/base.entity';
import { ObjectionConstants } from '@src/lib/orm/objection/objection.constants';
import { DatabaseOptions } from '@src/lib/orm/objection/objection.interface';

@Injectable()
export class ObjectionService {
  static config: DatabaseOptions;
  static connections: Record<string, KnexType>;

  constructor(
    @Inject(ObjectionConstants.databaseOptions) config: DatabaseOptions,
  ) {
    if (!config) throw new Error('No default connection specified.');
    const default_connection = config.connections[config.default];

    ObjectionService.config = config;
    ObjectionService.connections = { default: Knex(default_connection) };
    Model.knex(ObjectionService.connections.default);
    for (const [name, connection] of Object.entries(config.connections))
      if (name !== config.default)
        ObjectionService.connections[name] = Knex(connection);
  }

  static connection(name?: string): KnexType {
    return ObjectionService.connections[
      name ?? ObjectionService.config.default
    ];
  }

  static async transaction<T>(
    name: string,
    callback: (trx: KnexType.Transaction) => Promise<T>,
  ): Promise<T> {
    return ObjectionService.connection(name).transaction(callback);
  }
}
