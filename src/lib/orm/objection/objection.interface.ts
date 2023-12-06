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

export interface IPaginationOptions {
  /**
   * the page that is requested
   */
  page: number | string;
  /**
   * the amount of items to be requested per page
   */
  per_page: number | string;
  /**
   * sort by field
   */
  sort?: string;
  /**
   * sort order
   */
  order?: 'asc' | 'desc' | 'ASC' | 'DESC';
  /**
   * a route for generating links (i.e., WITHOUT query params)
   */
  route?: string;
}

export interface IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  total: number;
  /**
   * the total amount of items
   */
  per_page: number;
  /**
   * the current page this paginator "points" to
   */
  current_page: number;
  /**
   * the total amount of pages in this paginator
   */
  total_pages: number;
  /**
   * a link to the "first" page
   */
  first?: string;
  /**
   * a link to the "previous" page
   */
  previous?: string;
  /**
   * a link to the "next" page
   */
  next?: string;
  /**
   * a link to the "last" page
   */
  last?: string;
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
