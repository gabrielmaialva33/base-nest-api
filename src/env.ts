import 'dotenv/config';

import { bool, cleanEnv, num, str } from 'envalid';
import { Logger } from '@nestjs/common';

export const Env = cleanEnv(process.env, {
  // App
  NODE_ENV: str({ default: 'development', desc: 'The environment to run in' }),
  HOST: str({ default: '0.0.0.0', desc: 'The host to run on' }),
  PORT: num({ default: 3000, desc: 'The port to run on' }),
  API_PREFIX: str({ default: 'api', desc: 'The api prefix' }),

  // JWT
  JWT_SECRET: str({ default: 'secret', desc: 'The jwt secret' }),
  JWT_ACCESS_EXPIRY: str({
    default: '1d',
    desc: 'The jwt access token expiry',
  }),
  JWT_REFRESH_EXPIRY: str({
    default: '7d',
    desc: 'The jwt refresh token expiry',
  }),

  // Database
  DB_CLIENT: str({
    default: 'sqlite',
    desc: 'The database client (sqlite, pg)',
  }),
  DB_HOST: str({ default: 'localhost', desc: 'The database host' }),
  DB_PORT: num({ default: 5432, desc: 'The database port' }),
  DB_USER: str({ default: 'postgres', desc: 'The database users' }),
  DB_PASSWORD: str({ default: 'postgres', desc: 'The database password' }),
  DB_NAME: str({ default: 'postgres', desc: 'The database name' }),
  DB_DEBUG: bool({ default: false, desc: 'The database debug mode' }),

  // Mail
  MAIL_SERVER: str({ default: 'smtp', desc: 'The mail server (smtp, ses)' }),
  MAIL_USERNAME: str({
    default: 'username',
    desc: 'The mail username (required for smtp)',
  }),
  MAIL_PASSWORD: str({
    default: 'password',
    desc: 'The mail password (required for smtp)',
  }),
  MAIL_HOST: str({
    default: 'localhost',
    desc: 'The mail host (required for smtp)',
  }),
  MAIL_PORT: num({ default: 1025, desc: 'The mail port (required for smtp)' }),
  MAIL_PREVIEW_EMAIL: bool({
    default: false,
    desc: 'The mail preview email',
  }),
  MAIL_BCC_LIST: str({ default: '', desc: 'The mail bcc list' }),
  MAIL_TEMPLATE_DIR: str({
    default: 'templates',
    desc: 'The mail template directory',
  }),
  MAIL_SENDER_EMAIL: str({ default: '', desc: 'The mail sender email' }),

  // AWS SES
  MAIL_SES_KEY: str({ default: '', desc: 'The mail ses key' }),
  MAIL_SES_ACCESS_KEY: str({
    default: '',
    desc: 'The mail ses access key',
  }),
  MAIL_SES_REGION: str({ default: 'sa-east-1', desc: 'The mail ses region' }),

  // Twilio
  TWILIO_ACCOUNT_SID: str({
    default: '',
    desc: 'The twilio account sid',
  }),
  TWILIO_AUTH_TOKEN: str({
    default: '',
    desc: 'The twilio auth token',
  }),
  TWILIO_FROM: str({
    default: '',
    desc: 'The twilio from number',
  }),

  // AWS S3
  AWS_S3_BUCKET: str({
    default: '',
    desc: 'The aws s3 bucket',
  }),
  AWS_S3_ACCESS_KEY_ID: str({
    default: '',
    desc: 'The aws s3 access key id',
  }),
  AWS_S3_SECRET_ACCESS_KEY: str({
    default: '',
    desc: 'The aws s3 secret access key',
  }),
  AWS_S3_REGION: str({
    default: 'sa-east-1',
    desc: 'The aws s3 region',
  }),
  AWS_S3_ENDPOINT: str({
    default: 'https://s3.sa-east-1.amazonaws.com/',
    desc: 'The aws s3 endpoint',
  }),
  S3_CLOUDFRONT_URL: str({
    default: '',
    desc: 'The aws s3 cloudfront url',
  }),
});

export const validateEnv = (config: Record<any, any>) => {
  Logger.log(`Validating environment variables...`, 'Env');
  return config;
};
