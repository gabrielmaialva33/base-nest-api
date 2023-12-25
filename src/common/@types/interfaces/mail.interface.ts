import { EmailTemplate } from '@src/common/@types/enums/misc.enum';

export interface MailPayload {
  template: string;
  replacements: Record<string, string>;
  to: string;
  subject: string;
  from: string;
}

export type TEmailSubject =
  keyof typeof EmailTemplate extends `${infer T}_TEMPLATE` ? T : never;
