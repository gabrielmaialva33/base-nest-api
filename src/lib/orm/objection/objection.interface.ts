import { Knex } from 'knex';
import { ModuleMetadata, Type } from '@nestjs/common';
import { FetchGraphOptions } from 'objection';

export interface DatabaseOptions {
  isGlobal?: boolean;
  default: string;
  connections: Record<string, Knex.Config>;
}

export interface DatabaseAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  isGlobal?: boolean;
  useExisting?: Type<DatabaseOptions>;
  useClass?: Type<DatabaseAsyncOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<DatabaseOptions> | DatabaseOptions;
  inject?: any[];
}

export interface DatabaseAsyncOptionsFactory {
  createOptions(): Promise<DatabaseOptions> | DatabaseOptions;
}

export interface NestedLoadRelSchema {
  $recursive?: boolean | number;
  $relation?: string;
  $modify?: string[];

  [key: string]:
    | boolean
    | number
    | string
    | string[]
    | NestedLoadRelSchema
    | undefined;
}

export interface LoadRelSchema {
  [key: string]: boolean | NestedLoadRelSchema;
}

export type LoadRelOptions = FetchGraphOptions;
