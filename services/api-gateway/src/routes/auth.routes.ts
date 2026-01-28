import { Router, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { validate } from '../utils/validators';
import Joi from 'joi';

const router = Router();

// Mock user for demo
const mockUser = {
  id: 'user-1',
  email: 'user@example.com',
  password: 'password123', // In production, use hashed passwords!
  roles: ['customer'],
  permissions: ['order:create', 'order:read:own', 'payment:create']
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = validate(loginSchema, req.body);
    if (email !== mockUser.email || password !== mockUser.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = {
      sub: mockUser.id,
      email: mockUser.email,
      roles: mockUser.roles,
      permissions: mockUser.permissions
    };
    const accessToken = jwt.sign(
      payload,
      config.jwt.secret as string,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );
    const refreshToken = jwt.sign(
      payload,
      config.jwt.refreshSecret as string,
      { expiresIn: config.jwt.refreshExpiresIn } as SignOptions
    );
    res.json({ accessToken, refreshToken, expiresIn: config.jwt.expiresIn });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Add more auth endpoints (register, refresh, logout) as needed

export default router;
