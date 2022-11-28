import { FastifyServerOptions } from 'fastify';

export const FastifyConfig = {
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
      },
    },
  },
} as FastifyServerOptions;
