import { Migration } from '@mikro-orm/migrations';

export class Migration20221127011817 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "logs" add column "user_id" uuid null;');
    this.addSql(
      'comment on column "logs"."user_id" is \'user who made the request\';',
    );
    this.addSql(
      'alter table "logs" add constraint "logs_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "logs" drop constraint "logs_user_id_foreign";');

    this.addSql('alter table "logs" drop column "user_id";');
  }
}
