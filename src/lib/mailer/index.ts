import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Server, TemplateEngine } from '@src/common/@types';
import { MailModule } from '@src/lib/mailer/mailer.module';

@Global()
@Module({
  imports: [
    MailModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configs, true>) => ({
        credentials: {
          type: configService.get('mail.type', { infer: true }) as Server.SMTP,
          host: configService.get('mail.host', { infer: true }),
          port: configService.get('mail.port', { infer: true }),
          username: configService.get('mail.username', { infer: true }),
          password: configService.get('mail.password', { infer: true }),
        },
        previewEmail: configService.get('mail.previewEmail', { infer: true }),
        templateDir: configService.get('mail.templateDir', { infer: true }),
        templateEngine: TemplateEngine.ETA,
      }),
    }),
  ],
  exports: [MailModule],
})
export class NestMailModule {}
