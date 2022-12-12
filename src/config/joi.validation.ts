import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.required(),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.required(),
  DB_NAME: Joi.required(),
  DB_USERNAME: Joi.required(),
  DB_PASSWORD: Joi.required(),
  AWS_ACCESS_KEY_ID: Joi.required(),
  AWS_SECRET_ACCESS_KEY: Joi.required(),
});
