import { registerAs } from '@nestjs/config';

export const twilio = registerAs('twilio', () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  from: process.env.TWILIO_FROM,
}));
