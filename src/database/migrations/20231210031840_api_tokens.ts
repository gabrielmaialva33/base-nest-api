import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('api_tokens', (table) => {
    table.increments('id').primary();

    table.string('name').notNullable();
    table.string('type').notNullable();
    table.string('token').notNullable().unique();

    table.integer('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');

    table.timestamp('expires_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('api_tokens');
}
