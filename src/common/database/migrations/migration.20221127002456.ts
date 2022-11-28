import { Migration } from '@mikro-orm/migrations';

export class Migration20221127002456 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "logs" ("id" uuid not null default uuid_generate_v4(), "ip" varchar(255) null, "remote_ip" varchar(255) null, "remote_port" int null, "remote_family" varchar(255) null, "method" varchar(255) null, "url" varchar(255) null, "protocol" varchar(255) null, "parameters" jsonb null, "query" jsonb null, "headers" jsonb null, "created_at" timestamptz(0) not null default now(), constraint "logs_pkey" primary key ("id"));',
    );
    this.addSql(
      'comment on table "logs" is \'request logs for the application\';',
    );
    this.addSql(
      'comment on column "logs"."ip" is \'ip address of the request\';',
    );
    this.addSql('comment on column "logs"."method" is \'request method\';');
    this.addSql('comment on column "logs"."url" is \'request url\';');
    this.addSql(
      'comment on column "logs"."parameters" is \'request parameters\';',
    );
    this.addSql('comment on column "logs"."query" is \'request query\';');
    this.addSql('comment on column "logs"."headers" is \'request headers\';');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "logs" cascade;');
  }
}
