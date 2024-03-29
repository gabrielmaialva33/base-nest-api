import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary().unsigned();
    table.string('first_name', 80).notNullable();
    table.string('last_name', 80).notNullable();
    table.string('email').notNullable().unique();
    table.string('password', 118).notNullable();
    table.string('avatar_url').nullable();
    table.string('username', 40).nullable().unique();

    table.string('remember_me_token').nullable();
    table.timestamp('last_login_at').nullable();

    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('is_email_verified').notNullable().defaultTo(false);
    table.boolean('is_deleted').notNullable().defaultTo(false);

    table.timestamp('deleted_at').nullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
