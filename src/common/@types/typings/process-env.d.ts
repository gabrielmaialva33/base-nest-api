/* The `export {};` statement is used to indicate that the file is a module and exports nothing. It is
often used in TypeScript files that only contain type declarations or interfaces, without any actual
code or exports. This statement ensures that the file is treated as a module and not as a script. */
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      HOST: string;
      PORT: string;
      API_PREFIX: string;

      JWT_SECRET: string;
      JWT_EXPIRATION_TIME: string;
      JWT_REFRESH_EXPIRY_TIME: string;

      DB_CLIENT: 'pg' | 'sqlite3';
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_DEBUG: string;

      MAIL_USERNAME: string;
      MAIL_PASSWORD: string;
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_SERVER: string;
      MAIL_PREVIEW_EMAIL: string;
      MAIL_BCC_LIST: string;
      MAIL_TEMPLATE_DIR: string;
      MAIL_SENDER_EMAIL: string;
      MAIL_SES_KEY: string;
      MAIL_SES_ACCESS_KEY: string;
      MAIL_SES_REGION: string;
    }
  }
}
