import { Knex } from 'knex';

import { Logger } from '@nestjs/common';

export const KnexUtils = {
  formatSql: (sql: string, bindings: any[]) => {
    if (sql === undefined) return '';
    if (bindings === undefined) return sql;

    let i = 0;
    return sql.replace(/\?/g, () => {
      const item = bindings[i++];
      if (typeof item === 'string') return `'${item}'`;
      return item;
    });
  },
};

export const KnexLogger = {
  debug: (message) => {
    if (message.sql)
      Logger.debug(
        KnexUtils.formatSql(message.sql, message.bindings),
        'Knex-SQL',
      );
    else Logger.debug(message, 'Knex-SQL');
  },
  error: (message) => {
    if (message.sql)
      Logger.error(
        KnexUtils.formatSql(message.sql, message.bindings),
        'Knex-SQL',
      );
    else Logger.error(message, 'Knex-SQL');
  },
  warn: (message) => {
    if (message.sql)
      Logger.warn(
        KnexUtils.formatSql(message.sql, message.bindings),
        'Knex-SQL',
      );
    else Logger.warn(message, 'Knex-SQL');
  },
  enableColors: true,
} as Knex.Logger;
