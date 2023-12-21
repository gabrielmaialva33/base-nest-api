import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_roles', (table) => {
    table.increments('id').primary();

    table.integer('user_id').notNullable();
    table.integer('role_id').notNullable();

    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users');
    table.foreign('role_id').references('id').inTable('roles');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_roles');
}
