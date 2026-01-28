import Joi from 'joi';

export function validate(schema: Joi.ObjectSchema, data: any) {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
}
