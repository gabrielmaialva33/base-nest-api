import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { MailerService } from '@src/lib/mailer/mailer.service';
import { ConfigurableModuleClass } from '@src/lib/mailer/mail.module-definition';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailModule
  extends ConfigurableModuleClass
  implements OnModuleInit
{
  constructor(private readonly mailService: MailerService) {
    super();
  }

  async onModuleInit() {
    await this.mailService.checkConnection();
  }
}
