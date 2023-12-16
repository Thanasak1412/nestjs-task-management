import * as Joi from 'joi';

export const configValidationDbSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});

export const configValidationAppSchema = Joi.object({
  APP_PORT: Joi.string().default(3000).required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'uat')
    .default('development')
    .required(),
});
