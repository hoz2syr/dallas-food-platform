import request from 'supertest';
import express from 'express';
import { validate } from '../../src/utils/validators';
import Joi from 'joi';

describe('Input Validation Utility', () => {
  it('should validate correct input', () => {
    const schema = Joi.object({ name: Joi.string().required() });
    const data = { name: 'test' };
    expect(validate(schema, data)).toEqual(data);
  });

  it('should throw on invalid input', () => {
    const schema = Joi.object({ name: Joi.string().required() });
    expect(() => validate(schema, {})).toThrow();
  });
});
