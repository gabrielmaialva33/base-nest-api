import { registerAs } from '@nestjs/config';
import { Env } from '@src/env';

export const mail = registerAs('mail', () => ({
  username: Env.MAIL_USERNAME,
  password: Env.MAIL_PASSWORD,
  host: Env.MAIL_HOST,
  port: Env.MAIL_PORT,
  type: Env.MAIL_SERVER,
  previewEmail: Env.MAIL_PREVIEW_EMAIL,
  bccList: Env.MAIL_BCC_LIST,
  templateDir: Env.MAIL_TEMPLATE_DIR,
  senderEmail: Env.MAIL_SENDER_EMAIL,
  sesKey: Env.MAIL_SES_KEY,
  sesAccessKey: Env.MAIL_SES_ACCESS_KEY,
  sesRegion: Env.MAIL_SES_REGION,
}));
