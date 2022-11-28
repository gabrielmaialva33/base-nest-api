import * as Joi from 'joi';

export const ValidationSchema = Joi.object({
  // App
  HOST: Joi.string().required(),
  PORT: Joi.number().required(),
  SECRET_KEY: Joi.string().required(),
  // Database
  DATABASE_URL: Joi.string().optional(),
  PG_HOST: Joi.string().required(),
  PG_PORT: Joi.number().required(),
  PG_USER: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_DB: Joi.string().required(),
  PG_DEBUG: Joi.boolean().default(false).optional(),
  PR_SSL: Joi.boolean().default(false).optional(),
});
